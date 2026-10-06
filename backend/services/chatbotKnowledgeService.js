const STOP_WORDS = new Set([
  "a", "an", "and", "are", "at", "can", "do", "does", "for", "how", "i",
  "in", "is", "it", "me", "my", "of", "on", "our", "please", "the", "to",
  "we", "what", "when", "where", "which", "who", "with", "you", "your",
]);

const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) =>
  normalize(value)
    .split(" ")
    .map((token) => {
      const singular = {
        events: "event",
        fees: "fee",
        meetings: "meeting",
        running: "run",
        runners: "runner",
        schedules: "schedule",
        starts: "start",
      };
      if (["meet", "meeting", "point", "start"].includes(token)) return "location";
      if (["next", "upcoming"].includes(token)) return "upcoming";
      return singular[token] || token;
    })
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const INJECTION_PATTERN =
  /\b(ignore|disregard|forget|override)\b.{0,50}\b(instructions|rules|previous|system|prompt)\b|\b(system prompt|system instructions|api key|act as chatgpt|tell me a joke|write (me )?(code|a program|python)|prime minister)\b/i;

const UNRELATED_TOPIC_PATTERN =
  /\b(python|javascript|programming|source code|write code|joke|prime minister|politics|weather|stock price)\b/i;
const RUN_CLUB_PATTERN =
  /\b(run club|running club|645|run|runs|runner|runners|running|jog|jogging|race|marathon|membership|member|join|sign[\s-]?up|enroll|register|registration|club|training|workout|event|schedule|fees?|dues|announcement|facility|facilities|location|meet|meeting|shoes?|trail)\b/i;

const FOLLOW_UP_PATTERN = /^(where|when|what about|and|there|it|that|how much|which one)\b/i;

export const isRunClubRelated = (message, history = []) => {
  if (INJECTION_PATTERN.test(message) || UNRELATED_TOPIC_PATTERN.test(message)) return false;
  if (RUN_CLUB_PATTERN.test(message)) return true;

  const isFollowUp =
    message.trim().split(/\s+/).length <= 8 && FOLLOW_UP_PATTERN.test(message.trim());
  if (!isFollowUp) return false;

  const previousUserMessage = [...history]
    .reverse()
    .find((entry) => entry.role === "user")?.content;
  return Boolean(previousUserMessage && RUN_CLUB_PATTERN.test(previousUserMessage));
};

const scoreEntry = (entry, query) => {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;

  const questionTokens = new Set(tokenize(entry.question));
  const answerTokens = new Set(tokenize(entry.answer));
  const keywordTokens = new Set(entry.keywords.flatMap(tokenize));
  let score = 0;

  for (const token of queryTokens) {
    if (questionTokens.has(token)) score += 3;
    if (keywordTokens.has(token)) score += 4;
    if (answerTokens.has(token)) score += 1;
  }

  const normalizedQuery = normalize(query);
  if (normalize(entry.question).includes(normalizedQuery)) score += 8;
  return score + (entry.priority || 0) / 100;
};

export const findRelevantKnowledge = (entries, query, limit = 3) =>
  entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter(({ score }) => score >= 3)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

export const buildRetrievalQuery = (message, history = []) => {
  const isFollowUp =
    message.trim().split(/\s+/).length <= 8 && FOLLOW_UP_PATTERN.test(message.trim());
  if (!isFollowUp) return message;

  const priorUserMessage = [...history]
    .reverse()
    .find((entry) => entry.role === "user")?.content;
  return priorUserMessage ? `${priorUserMessage} ${message}` : message;
};
