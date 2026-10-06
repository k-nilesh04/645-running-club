import { useEffect, useRef, useState } from "react";
import { getChatbotSuggestions, sendChatMessage } from "../../api/api.js";
import "./chatbot.css";

const welcomeMessage = {
  role: "assistant",
  content: "Hi! 👋 I'm the Run Club assistant. How can I help you?",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const toggleRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    getChatbotSuggestions()
      .then(({ data }) => setSuggestions(data.suggestions || []))
      .catch(() => setSuggestions([]));
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const submitMessage = async (value = draft) => {
    const message = value.trim();
    if (!message || loading) return;

    const priorMessages = messages.filter((entry) => entry !== welcomeMessage);
    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const { data } = await sendChatMessage({
        message,
        history: priorMessages.slice(-6).map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer || "I couldn't get an answer just now." },
      ]);
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.answer || requestError.response?.data?.message;
      const friendlyMessage =
        responseMessage || (requestError.response
          ? "I'm having trouble responding right now. Please try again in a moment."
          : "I can't reach the Run Club service right now. Please try again later.");
      setMessages((current) => [...current, { role: "assistant", content: friendlyMessage }]);
      setError(requestError.response?.status === 429 ? "Rate limit reached." : "");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="run-chat">
      {open && (
        <section
          className="run-chat__panel"
          role="dialog"
          aria-label="Run Club Assistant"
          aria-modal="false"
        >
          <header className="run-chat__header">
            <div className="run-chat__identity">
              <span className="run-chat__avatar" aria-hidden="true">🏃</span>
              <div>
                <h2>Run Club Assistant</h2>
                <p><span className="run-chat__status" /> Here to help</p>
              </div>
            </div>
            <button
              type="button"
              className="run-chat__close"
              aria-label="Close Run Club chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="run-chat__messages" aria-live="polite" aria-relevant="additions">
            {messages.map((entry, index) => (
              <div
                key={`${index}-${entry.role}`}
                className={`run-chat__message run-chat__message--${entry.role}`}
              >
                {entry.content}
              </div>
            ))}
            {messages.length === 1 && suggestions.length > 0 && (
              <div className="run-chat__suggestions" aria-label="Suggested questions">
                <p>Try asking</p>
                {suggestions.map((item) => (
                  <button
                    type="button"
                    key={item._id}
                    disabled={loading}
                    onClick={() => submitMessage(item.question)}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="run-chat__message run-chat__message--assistant" aria-label="Assistant is typing">
                <span className="run-chat__typing"><i /><i /><i /></span>
              </div>
            )}
            {error && <p className="run-chat__notice" role="status">{error}</p>}
            <div ref={endRef} />
          </div>

          <form
            className="run-chat__form"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage();
            }}
          >
            <label className="run-chat__sr-only" htmlFor="run-chat-message">
              Ask a Run Club question
            </label>
            <input
              id="run-chat-message"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question..."
              maxLength={1000}
              disabled={loading}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !draft.trim()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 20.5 22 12 3 3.5 3 10l13 2-13 2z" />
              </svg>
            </button>
          </form>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="run-chat__launcher"
        aria-label={open ? "Close Run Club Assistant" : "Open Run Club Assistant"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
