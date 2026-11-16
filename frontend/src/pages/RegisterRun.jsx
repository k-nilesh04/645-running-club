import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerForRun, getUpcomingRuns, getMyRegistrations, unregisterForRun } from "../api/api.js";
import { isLoggedIn } from "../utils/auth.js";

export default function RegisterRun() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [registeredRuns, setRegisteredRuns] = useState(new Set());
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => { fetchRuns(); }, []);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const requests = [getUpcomingRuns()];
      if (isLoggedIn()) requests.push(getMyRegistrations());
      const [runsResponse, myRegistrationsResponse] = await Promise.all(requests);
      setRuns(runsResponse.data.runs || []);
      setRegisteredRuns(myRegistrationsResponse ? new Set(myRegistrationsResponse.data.runIds || []) : new Set());
      setStatus({ type: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Could not fetch runs" });
    } finally { setLoading(false); }
  };

  const handleRegister = async (runId) => {
    if (!isLoggedIn()) { setShowSignupPrompt(true); return; }
    setRegistering((prev) => ({ ...prev, [runId]: true }));
    setStatus({ type: "", message: "" });
    try {
      if (registeredRuns.has(runId)) {
        await unregisterForRun(runId);
        setRegisteredRuns((prev) => { const next = new Set(prev); next.delete(runId); return next; });
        setStatus({ type: "success", message: "You have unregistered successfully" });
        return;
      }
      await registerForRun(runId);
      setRegisteredRuns((prev) => new Set([...prev, runId]));
      setStatus({ type: "success", message: "You have registered successfully!" });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Could not update registration for this run" });
    } finally { setRegistering((prev) => ({ ...prev, [runId]: false })); }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <section className="section min-h-[60vh]">
      {showSignupPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#202420] p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">One quick step</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">Join before you run</h2>
            <p className="mb-6 mt-3 text-sm leading-6 text-offwhite/60">Create an account or sign in to register for a club run.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowSignupPrompt(false)} className="btn-outline flex-1">Maybe later</button>
              <button onClick={() => navigate("/auth")} className="btn-primary flex-1">Sign in / Sign up</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 border-b border-white/10 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Come run with us</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Upcoming runs<span className="text-primary">.</span></h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-offwhite/55">See what's coming up and reserve your place. We'd love to see you there.</p>
      </div>

      {status.message && <div role="status" className={`mb-6 border-l-2 px-4 py-3 text-sm ${status.type === "success" ? "border-primary bg-primary/10 text-primary" : "border-red-400 bg-red-400/10 text-red-300"}`}>{status.message}</div>}

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />)}</div>
      ) : runs.length === 0 ? (
        <div className="border-y border-white/10 py-16 text-center"><p className="font-display text-xl font-semibold text-white">No upcoming runs just yet</p><p className="mt-2 text-sm text-offwhite/45">Check back soon. We'll see you on the next Sunday.</p></div>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <article key={run._id} className="grid gap-5 rounded-xl border border-white/10 bg-[#202420] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-3"><h2 className="font-display text-xl font-semibold text-white">{run.title}</h2>{registeredRuns.has(run._id) && <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">You're registered</span>}</div>
                <p className="mt-2 text-sm text-offwhite/55">{run.description || "Join the community for a run together."}</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-offwhite/65">
                  <span><span className="mr-2 text-primary">◷</span>{formatDate(run.date)} · {run.startTime}</span>
                  {run.location?.name && <span><span className="mr-2 text-primary">⌖</span>{run.location.name}</span>}
                  {run.distance && <span><span className="mr-2 text-primary">↗</span>{run.distance} km</span>}
                </div>
              </div>
              <button onClick={() => handleRegister(run._id)} disabled={registering[run._id]} className={`min-w-36 rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${registeredRuns.has(run._id) ? "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20" : "btn-primary"}`}>
                {registering[run._id] ? "Please wait..." : registeredRuns.has(run._id) ? "Cancel registration" : "Register"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}