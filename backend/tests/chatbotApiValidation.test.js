import test from "node:test";
import assert from "node:assert/strict";
import { validateChatPayload } from "../controller/chatbotController.js";
import chatbotRateLimiter from "../middlewares/chatbotRateLimiter.js";
import { generateRunClubAnswer } from "../services/geminiService.js";

test("rejects empty, malformed, and overlong chatbot messages", () => {
  const originalMaxLength = process.env.CHAT_MAX_MESSAGE_LENGTH;
  process.env.CHAT_MAX_MESSAGE_LENGTH = "5";
  try {
    assert.equal(validateChatPayload({ message: "  " }), null);
    assert.equal(validateChatPayload([]), null);
    assert.equal(validateChatPayload({ message: "123456" }), null);
    assert.deepEqual(validateChatPayload({ message: " run " }), { message: "run", history: [] });
  } finally {
    if (originalMaxLength === undefined) delete process.env.CHAT_MAX_MESSAGE_LENGTH;
    else process.env.CHAT_MAX_MESSAGE_LENGTH = originalMaxLength;
  }
});

test("rate limits repeat requests per IP and returns a friendly response", () => {
  const previousLimit = process.env.CHAT_RATE_LIMIT_MAX;
  process.env.CHAT_RATE_LIMIT_MAX = "1";
  const req = { ip: `test-${Date.now()}-${Math.random()}` };
  let nextCalled = false;
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  try {
    chatbotRateLimiter(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    nextCalled = false;
    chatbotRateLimiter(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 429);
    assert.match(res.body.message, /wait a moment/i);
  } finally {
    if (previousLimit === undefined) delete process.env.CHAT_RATE_LIMIT_MAX;
    else process.env.CHAT_RATE_LIMIT_MAX = previousLimit;
  }
});

test("reports missing Gemini configuration without exposing secrets", async () => {
  const configuredKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    await assert.rejects(
      generateRunClubAnswer({ question: "When is the run?", context: [] }),
      /GEMINI_API_KEY is not configured/
    );
  } finally {
    if (configuredKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = configuredKey;
  }
});
