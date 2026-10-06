import mongoose from "mongoose";
import ChatbotKnowledge from "../models/chatbotKnowledge.model.js";
import { buildRetrievalQuery, findRelevantKnowledge, isRunClubRelated } from "../services/chatbotKnowledgeService.js";
import { generateRunClubAnswer } from "../services/geminiService.js";

const categories = [
  "membership",
  "registration",
  "events",
  "schedule",
  "location",
  "fees",
  "rules",
  "activities",
  "announcements",
  "facilities",
  "contact",
  "general",
];

const outOfScopeAnswer =
  "I'm the Run Club assistant, so I can only help with Run Club-related questions.";
const unknownAnswer =
  "I don't have that information yet. Please contact the Run Club team.";
const serviceErrorAnswer =
  "I'm having trouble responding right now. Please try again in a moment.";

export const validateChatPayload = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const maxLength = Math.min(5000, Math.max(1, Number(process.env.CHAT_MAX_MESSAGE_LENGTH) || 1000));
  if (!message || message.length > maxLength) return null;

  if (body.conversationId !== undefined &&
      (typeof body.conversationId !== "string" || body.conversationId.length > 100)) {
    return null;
  }

  if (body.history !== undefined && !Array.isArray(body.history)) return null;
  const history = (body.history || []).slice(-6);
  if (history.some((entry) =>
    !entry ||
    !["user", "assistant"].includes(entry.role) ||
    typeof entry.content !== "string" ||
    entry.content.length > 1000
  )) {
    return null;
  }

  return {
    message,
    history: history.map(({ role, content }) => ({ role, content: content.trim() })),
  };
};

export const chat = async (req, res) => {
  const payload = validateChatPayload(req.body);
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "Please send a valid, non-empty message within the allowed length.",
    });
  }

  const { message, history } = payload;
  if (!isRunClubRelated(message, history)) {
    return res.json({
      success: true,
      answer: outOfScopeAnswer,
      category: "out_of_scope",
      source: "scope_filter",
    });
  }

  try {
    const entries = await ChatbotKnowledge.find({ isActive: true }).lean();
    const query = buildRetrievalQuery(message, history);
    const relevantEntries = findRelevantKnowledge(entries, query);

    if (!relevantEntries.length) {
      return res.json({
        success: true,
        answer: unknownAnswer,
        category: "unknown",
        source: "knowledge_base",
      });
    }

    const answer = await generateRunClubAnswer({
      question: message,
      context: relevantEntries,
      history,
    });
    return res.json({
      success: true,
      answer,
      category: relevantEntries[0].category,
      source: "knowledge_base",
    });
  } catch (error) {
    console.error("Run Club chatbot error:", error);
    return res.status(503).json({
      success: false,
      answer: serviceErrorAnswer,
      message: serviceErrorAnswer,
    });
  }
};

export const getChatbotSuggestions = async (req, res) => {
  try {
    const entries = await ChatbotKnowledge.find({ isActive: true })
      .select("question category priority")
      .sort({ priority: -1, updatedAt: -1 })
      .limit(4)
      .lean();
    return res.json({ success: true, suggestions: entries });
  } catch (error) {
    console.error("Chatbot suggestions error:", error);
    return res.status(500).json({ success: false, message: "Could not load suggestions." });
  }
};

const validateKnowledge = (body, partial = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const value = {};

  if (!partial || body.question !== undefined) {
    if (typeof body.question !== "string" || !body.question.trim() || body.question.trim().length > 300) return null;
    value.question = body.question.trim();
  }
  if (!partial || body.answer !== undefined) {
    if (typeof body.answer !== "string" || !body.answer.trim() || body.answer.trim().length > 3000) return null;
    value.answer = body.answer.trim();
  }
  if (!partial || body.category !== undefined) {
    if (!categories.includes(body.category)) return null;
    value.category = body.category;
  }
  if (body.keywords !== undefined) {
    if (!Array.isArray(body.keywords) || body.keywords.length > 30 ||
        body.keywords.some((keyword) => typeof keyword !== "string" || keyword.trim().length > 50)) return null;
    value.keywords = [...new Set(body.keywords.map((keyword) => keyword.trim()).filter(Boolean))];
  } else if (!partial) {
    value.keywords = [];
  }
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") return null;
    value.isActive = body.isActive;
  } else if (!partial) {
    value.isActive = true;
  }
  if (body.priority !== undefined) {
    if (!Number.isInteger(body.priority) || body.priority < 0 || body.priority > 100) return null;
    value.priority = body.priority;
  } else if (!partial) {
    value.priority = 0;
  }

  return value;
};

export const listChatbotKnowledge = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      const search = String(req.query.search).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
        { keywords: { $regex: search, $options: "i" } },
      ];
    }
    if (categories.includes(req.query.category)) filter.category = req.query.category;
    const entries = await ChatbotKnowledge.find(filter).sort({ updatedAt: -1 }).lean();
    return res.json({ success: true, entries });
  } catch (error) {
    console.error("List chatbot knowledge error:", error);
    return res.status(500).json({ success: false, message: "Could not load chatbot knowledge." });
  }
};

export const createChatbotKnowledge = async (req, res) => {
  const value = validateKnowledge(req.body);
  if (!value) return res.status(400).json({ success: false, message: "Invalid knowledge entry." });
  try {
    const entry = await ChatbotKnowledge.create(value);
    return res.status(201).json({ success: true, entry });
  } catch (error) {
    console.error("Create chatbot knowledge error:", error);
    return res.status(500).json({ success: false, message: "Could not create knowledge entry." });
  }
};

export const updateChatbotKnowledge = async (req, res) => {
  const { entryId } = req.params;
  if (!mongoose.isValidObjectId(entryId)) {
    return res.status(400).json({ success: false, message: "Invalid knowledge entry id." });
  }
  const value = validateKnowledge(req.body, true);
  if (!value || Object.keys(value).length === 0) {
    return res.status(400).json({ success: false, message: "Invalid knowledge entry." });
  }
  try {
    const entry = await ChatbotKnowledge.findByIdAndUpdate(entryId, value, {
      new: true,
      runValidators: true,
    });
    if (!entry) return res.status(404).json({ success: false, message: "Knowledge entry not found." });
    return res.json({ success: true, entry });
  } catch (error) {
    console.error("Update chatbot knowledge error:", error);
    return res.status(500).json({ success: false, message: "Could not update knowledge entry." });
  }
};

export const deleteChatbotKnowledge = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.entryId)) {
    return res.status(400).json({ success: false, message: "Invalid knowledge entry id." });
  }
  try {
    const entry = await ChatbotKnowledge.findByIdAndDelete(req.params.entryId);
    if (!entry) return res.status(404).json({ success: false, message: "Knowledge entry not found." });
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete chatbot knowledge error:", error);
    return res.status(500).json({ success: false, message: "Could not delete knowledge entry." });
  }
};
