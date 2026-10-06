import mongoose from "mongoose";

const chatbotKnowledgeSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 3000 },
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    keywords: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
      validate: [(keywords) => keywords.length <= 30, "Maximum 30 keywords allowed"],
    },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true, collection: "chatbot_knowledge" }
);

chatbotKnowledgeSchema.index({ isActive: 1, category: 1 });

export default mongoose.model("ChatbotKnowledge", chatbotKnowledgeSchema);
