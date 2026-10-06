import { useCallback, useEffect, useState } from "react";
import {
  createChatbotKnowledge,
  deleteChatbotKnowledge,
  getChatbotKnowledge,
  updateChatbotKnowledge,
} from "../../api/api.js";

const CATEGORIES = [
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

const EMPTY_FORM = {
  question: "",
  answer: "",
  category: "general",
  keywords: "",
  isActive: true,
  priority: 0,
};

export default function ChatbotKnowledgeAdmin() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getChatbotKnowledge({
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
      });
      setEntries(data.entries || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load chatbot knowledge.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(loadEntries, 250);
    return () => window.clearTimeout(timeout);
  }, [loadEntries]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId("");
    setError("");
  };

  const editEntry = (entry) => {
    setEditingId(entry._id);
    setForm({
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      keywords: (entry.keywords || []).join(", "),
      isActive: entry.isActive,
      priority: entry.priority || 0,
    });
    setNotice("");
  };

  const saveEntry = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      keywords: form.keywords.split(",").map((word) => word.trim()).filter(Boolean),
      priority: Number(form.priority),
    };

    try {
      if (editingId) {
        await updateChatbotKnowledge(editingId, payload);
        setNotice("Knowledge entry updated.");
      } else {
        await createChatbotKnowledge(payload);
        setNotice("Knowledge entry added.");
      }
      resetForm();
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save this knowledge entry.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEntry = async (entry) => {
    setError("");
    try {
      await updateChatbotKnowledge(entry._id, { isActive: !entry.isActive });
      setNotice(`Knowledge entry ${entry.isActive ? "disabled" : "enabled"}.`);
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update entry status.");
    }
  };

  const removeEntry = async (entry) => {
    if (!window.confirm(`Delete "${entry.question}"? This cannot be undone.`)) return;
    setError("");
    try {
      await deleteChatbotKnowledge(entry._id);
      if (editingId === entry._id) resetForm();
      setNotice("Knowledge entry deleted.");
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this knowledge entry.");
    }
  };

  return (
    <section className="mt-12" aria-labelledby="chatbot-knowledge-title">
      <div className="mb-5">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">Run Club assistant</p>
        <h2 id="chatbot-knowledge-title" className="font-display text-3xl font-bold text-white">
          Chatbot knowledge base
        </h2>
        <p className="mt-2 text-sm text-offwhite/60">
          Only active entries can be used to answer visitor questions.
        </p>
      </div>

      {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300" role="alert">{error}</p>}
      {notice && <p className="mb-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-primary" role="status">{notice}</p>}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="card h-fit space-y-4" onSubmit={saveEntry}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-white">
              {editingId ? "Edit knowledge" : "Add knowledge"}
            </h3>
            {editingId && (
              <button type="button" className="text-sm text-offwhite/70 underline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          <label className="block text-sm text-offwhite/80">
            Question
            <input
              required
              maxLength={300}
              value={form.question}
              onChange={(event) => setForm({ ...form, question: event.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm text-offwhite/80">
            Answer
            <textarea
              required
              rows={4}
              maxLength={3000}
              value={form.answer}
              onChange={(event) => setForm({ ...form, answer: event.target.value })}
              className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-offwhite/80">
              Category
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
              >
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block text-sm text-offwhite/80">
              Priority (0–100)
              <input
                type="number"
                min="0"
                max="100"
                value={form.priority}
                onChange={(event) => setForm({ ...form, priority: event.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
              />
            </label>
          </div>
          <label className="block text-sm text-offwhite/80">
            Keywords <span className="text-offwhite/50">(comma-separated)</span>
            <input
              value={form.keywords}
              onChange={(event) => setForm({ ...form, keywords: event.target.value })}
              placeholder="join, registration, membership"
              className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-offwhite/80">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              className="accent-primary"
            />
            Active and available to the chatbot
          </label>
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? "Saving..." : editingId ? "Save changes" : "Add knowledge"}
          </button>
        </form>

        <div className="card">
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_12rem]">
            <label className="text-sm text-offwhite/70">
              Search knowledge
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions, answers, keywords"
                className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
              />
            </label>
            <label className="text-sm text-offwhite/70">
              Category
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-dark px-3 py-2 text-white"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>

          {loading ? (
            <p className="py-6 text-center text-offwhite/60">Loading knowledge base...</p>
          ) : entries.length === 0 ? (
            <p className="py-6 text-center text-offwhite/60">No knowledge entries found. Add club-approved answers to get started.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <article key={entry._id} className="rounded-xl border border-white/10 bg-dark/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-white">{entry.question}</h4>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {entry.category}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${entry.isActive ? "bg-primary/10 text-primary" : "bg-white/10 text-offwhite/60"}`}>
                          {entry.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-offwhite/70">{entry.answer}</p>
                      {entry.keywords?.length > 0 && (
                        <p className="mt-2 text-xs text-offwhite/50">Keywords: {entry.keywords.join(", ")}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button type="button" className="text-primary hover:underline" onClick={() => editEntry(entry)}>Edit</button>
                      <button type="button" className="text-offwhite/70 hover:underline" onClick={() => toggleEntry(entry)}>
                        {entry.isActive ? "Disable" : "Enable"}
                      </button>
                      <button type="button" className="text-red-300 hover:underline" onClick={() => removeEntry(entry)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
