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

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const requests = [getUpcomingRuns()];

      if (isLoggedIn()) {
        requests.push(getMyRegistrations());
      }

      const [runsResponse, myRegistrationsResponse] = await Promise.all(requests);

      setRuns(runsResponse.data.runs || []);

      if (myRegistrationsResponse) {
        setRegisteredRuns(new Set(myRegistrationsResponse.data.runIds || []));
      } else {
        setRegisteredRuns(new Set());
      }

      setStatus({ type: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not fetch runs",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (runId) => {
    if (!isLoggedIn()) {
      setShowSignupPrompt(true);
      return;
    }

    setRegistering((prev) => ({ ...prev, [runId]: true }));
    setStatus({ type: "", message: "" });

    try {
      if (registeredRuns.has(runId)) {
        await unregisterForRun(runId);
        setRegisteredRuns((prev) => {
          const next = new Set(prev);
          next.delete(runId);
          return next;
        });
        setStatus({
          type: "success",
          message: "You have unregistered successfully",
        });
        return;
      }

      await registerForRun(runId);
      setRegisteredRuns((prev) => new Set([...prev, runId]));
      setStatus({
        type: "success",
        message: "You have registered successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not update registration for this run",
      });
    } finally {
      setRegistering((prev) => ({ ...prev, [runId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (showSignupPrompt) {
    return (
      <section className="section">
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4">
          <div className="card w-full max-w-md border-primary/30 shadow-2xl shadow-black/50">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Sign Up Required</h2>
            <p className="text-offwhite/70 mb-6">
              You need to sign up to register for runs. Create an account to get started!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="btn-outline flex-1"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="btn-primary flex-1"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Upcoming Runs
        </h1>
        <p className="text-offwhite/60 text-sm mb-8">
          Register for an upcoming Sunday run. Click the register button to join!
        </p>

        {status.message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              status.type === "success"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {status.message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-offwhite/60 py-12">
            Loading upcoming runs...
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center text-offwhite/60 py-12 card">
            No upcoming runs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {runs.map((run) => (
              <div
                key={run._id}
                className="card border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {run.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-offwhite/50 uppercase tracking-wide">
                      Date
                    </p>
                    <p className="text-sm text-white font-semibold">
                      {formatDate(run.date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-offwhite/50 uppercase tracking-wide">
                      Start Time
                    </p>
                    <p className="text-sm text-white font-semibold">
                      {run.startTime}
                    </p>
                  </div>

                  {run.location?.name && (
                    <div>
                      <p className="text-xs text-offwhite/50 uppercase tracking-wide">
                        Location
                      </p>
                      <p className="text-sm text-white font-semibold">
                        {run.location.name}
                      </p>
                    </div>
                  )}

                  {run.distance && (
                    <div>
                      <p className="text-xs text-offwhite/50 uppercase tracking-wide">
                        Distance
                      </p>
                      <p className="text-sm text-white font-semibold">
                        {run.distance} km
                      </p>
                    </div>
                  )}
                </div>

                {run.description && (
                  <p className="text-sm text-offwhite/70 mb-4 line-clamp-2">
                    {run.description}
                  </p>
                )}

                <button
                  onClick={() => handleRegister(run._id)}
                  disabled={registering[run._id]}
                  className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                    registeredRuns.has(run._id)
                      ? "bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
                      : "btn-primary"
                  }`}
                >
                  {registering[run._id]
                    ? "Registering..."
                    : registeredRuns.has(run._id)
                    ? "✓ Registered"
                    : "Register"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
