import express from "express";
import {
  chat,
  createChatbotKnowledge,
  deleteChatbotKnowledge,
  getChatbotSuggestions,
  listChatbotKnowledge,
  updateChatbotKnowledge,
} from "../controller/chatbotController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import chatbotRateLimiter from "../middlewares/chatbotRateLimiter.js";

const router = express.Router();

router.post("/", chatbotRateLimiter, chat);
router.get("/suggestions", getChatbotSuggestions);
router.use("/knowledge", isAuthenticated, isAdmin);
router.route("/knowledge").get(listChatbotKnowledge).post(createChatbotKnowledge);
router
  .route("/knowledge/:entryId")
  .patch(updateChatbotKnowledge)
  .delete(deleteChatbotKnowledge);

export default router;
