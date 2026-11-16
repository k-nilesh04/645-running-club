import { useEffect, useMemo, useState } from "react";
import {
  getAdminDashboard, updateAttendanceStatus, getAdminRuns,
  createAdminRun, updateAdminRun, deleteAdminRun,
} from "../api/api.js";
import ChatbotKnowledgeAdmin from "../components/chatbot/ChatbotKnowledgeAdmin.jsx";

const todayString = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const emptyDashboard = { summary: { totalUsers: 0, presentCount: 0, registeredCount: 0, absentCount: 0, paidMembersCount: 0 }, attendance: [], paidMembers: [], runs: [] };
const emptyRun = { title: "", description: "", date: todayString(), startTime: "06:15", locationName: "Dwarka Sector 19B Park", locationAddress: "Dwarka, New Delhi", distance: "5", maxParticipants: "", status: "upcoming" };

const tabs = [
  { id: "overview", label: "Overview", hint: "Daily snapshot" },
  { id: "runs", label: "Run management", hint: "Create and manage runs" },
  { id: "attendance", label: "Attendance", hint: "Check-ins and status" },
  { id: "members", label: "Members", hint: "Membership records" },
  { id: "assistant", label: "Chatbot", hint: "Knowledge base" },
];

function Field({ label, children }) {
  return <label className="block text-sm text-offwhite/75"><span className="mb-1.5 block">{label}</span>{children}</label>;
}
const inputClass = "mt-0 w-full rounded-md border border-white/15 bg-[#171b18] px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runsLoading, setRunsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [saving, setSaving] = useState({});
  const [runForm, setRunForm] = useState(emptyRun);
  const [editingRunId, setEditingRunId] = useState("");
  const [runSaving, setRunSaving] = useState(false);
  const [runSearch, setRunSearch] = useState("");
  const [runStatusFilter, setRunStatusFilter] = useState("all");
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAdminDashboard(selectedDate);
      setDashboard({ ...emptyDashboard, ...data });
      setSelectedAttendanceId((current) => data.attendance?.some((entry) => entry._id === current) ? current : data.attendance?.[0]?._id || null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin dashboard");
    } finally { setLoading(false); }
  };

  const fetchRuns = async () => {
    setRunsLoading(true);
    try {
      const { data } = await getAdminRuns();
      setRuns(data.runs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load runs");
    } finally { setRunsLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, [selectedDate]);
  useEffect(() => { if (activeTab === "runs") fetchRuns(); }, [activeTab]);

  const selectedAttendance = useMemo(() =>
    dashboard.attendance.find((entry) => entry._id === selectedAttendanceId) || dashboard.attendance[0] || null,
  [dashboard.attendance, selectedAttendanceId]);

  const filteredRuns = useMemo(() => runs.filter((run) => {
    const query = runSearch.trim().toLowerCase();
    const matchesQuery = !query || [run.title, run.description, run.location?.name].some((value) => String(value || "").toLowerCase().includes(query));
    return matchesQuery && (runStatusFilter === "all" || run.status === runStatusFilter);
  }), [runs, runSearch, runStatusFilter]);

  const handleStatusUpdate = async (attendanceId, status) => {
    setSaving((current) => ({ ...current, [attendanceId]: true }));
    setError(""); setNotice("");
    try {
      await updateAttendanceStatus(attendanceId, status, new Date().toISOString());
      setNotice("Attendance status updated.");
      await fetchDashboard();
    } catch (err) { setError(err.response?.data?.message || "Could not update attendance"); }
    finally { setSaving((current) => ({ ...current, [attendanceId]: false })); }
  };

  const resetRunForm = () => { setRunForm(emptyRun); setEditingRunId(""); };
  const startEditRun = (run) => {
    setEditingRunId(run._id);
    setRunForm({
      title: run.title || "", description: run.description || "",
      date: run.date ? new Date(run.date).toISOString().slice(0, 10) : todayString(),
      startTime: run.startTime || "06:15",
      locationName: run.location?.name || "", locationAddress: run.location?.address || "",
      distance: run.distance ?? "", maxParticipants: run.maxParticipants ?? "",
      status: run.status || "upcoming",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveRun = async (event) => {
    event.preventDefault();
    setRunSaving(true); setError(""); setNotice("");
    const payload = {
      title: runForm.title.trim(), description: runForm.description.trim(),
      date: runForm.date, startTime: runForm.startTime,
      location: { name: runForm.locationName.trim(), address: runForm.locationAddress.trim() },
      distance: runForm.distance === "" ? undefined : Number(runForm.distance),
      maxParticipants: runForm.maxParticipants === "" ? undefined : Number(runForm.maxParticipants),
      ...(editingRunId ? { status: runForm.status } : {}),
    };
    try {
      if (editingRunId) {
        await updateAdminRun(editingRunId, payload);
        setNotice("Run details updated.");
      } else {
        await createAdminRun(payload);
        setNotice("New run created successfully.");
      }
      resetRunForm();
      await fetchRuns();
      await fetchDashboard();
    } catch (err) { setError(err.response?.data?.message || "Could not save run"); }
    finally { setRunSaving(false); }
  };

  const removeRun = async (run) => {
    const confirmed = window.confirm(`Delete "${run.title}" and all registrations for this run? This cannot be undone.`);
    if (!confirmed) return;
    setError(""); setNotice("");
    try {
      await deleteAdminRun(run._id);
      if (editingRunId === run._id) resetRunForm();
      setNotice("Run and its registrations deleted.");
      await fetchRuns();
      await fetchDashboard();
    } catch (err) { setError(err.response?.data?.message || "Could not delete run"); }
  };

  const statCards = [
    ["Members", dashboard.summary.totalUsers, "Registered accounts"],
    ["Present", dashboard.summary.presentCount, "Marked present"],
    ["Registered", dashboard.summary.registeredCount, "Expected runners"],
    ["Paid members", dashboard.summary.paidMembersCount, "Active memberships"],
  ];

  return (
    <section className="section min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">645 Run Club · Workspace</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">Admin dashboard<span className="text-primary">.</span></h1>
            <p className="mt-2 text-sm text-offwhite/50">The day-to-day running of the club, all in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-offwhite/45">Viewing</span>
            <input aria-label="Dashboard date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-md border border-white/15 bg-[#202420] px-3 py-2 text-sm text-white outline-none focus:border-primary" />
          </div>
        </div>

        <nav aria-label="Admin sections" className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setError(""); setNotice(""); }}
              className={`border px-3 py-3 text-left transition ${activeTab === tab.id ? "border-primary bg-primary/10" : "border-white/10 bg-[#1b201c] hover:border-white/25"}`}>
              <span className={`block text-sm font-semibold ${activeTab === tab.id ? "text-primary" : "text-white"}`}>{tab.label}</span>
              <span className="mt-1 block text-[11px] text-offwhite/40">{tab.hint}</span>
            </button>
          ))}
        </nav>

        {error && <div role="alert" className="mb-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {notice && <div role="status" className="mb-5 border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">{notice}</div>}

        {activeTab === "overview" && (
          <div>
            <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold text-white">Daily overview</h2><p className="mt-1 text-sm text-offwhite/45">{formatDate(selectedDate)}</p></div><button type="button" onClick={fetchDashboard} className="border border-white/15 px-3 py-2 text-xs text-offwhite/70 hover:border-primary hover:text-primary">Refresh data</button></div>
            {loading ? <p className="py-12 text-center text-sm text-offwhite/50">Loading dashboard…</p> : <>
              <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {statCards.map(([label, value, caption]) => <article key={label} className="border border-white/10 bg-[#1b201c] p-4"><p className="text-xs text-offwhite/50">{label}</p><p className="mt-2 font-display text-3xl font-bold text-white">{value ?? 0}</p><p className="mt-1 text-[11px] text-offwhite/35">{caption}</p></article>)}
              </div>
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="border border-white/10 bg-[#1b201c] p-5">
                  <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-xl font-semibold text-white">Attendance activity</h3><button type="button" onClick={() => setActiveTab("attendance")} className="text-xs text-primary hover:underline">Open attendance →</button></div>
                  {dashboard.attendance.length ? <div className="space-y-3">{dashboard.attendance.slice(0, 5).map((entry) => <div key={entry._id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{entry.user?.name || "Unknown runner"}</p><p className="truncate text-xs text-offwhite/40">{entry.run?.title || "Run"}</p></div><span className="text-xs capitalize text-primary">{entry.status}</span></div>)}</div> : <p className="py-7 text-center text-sm text-offwhite/45">No attendance records for this date.</p>}
                </div>
                <div className="border border-white/10 bg-[#1b201c] p-5"><h3 className="font-display text-xl font-semibold text-white">Quick actions</h3><div className="mt-4 grid gap-2"><button onClick={() => { setActiveTab("runs"); resetRunForm(); }} className="border border-primary/40 px-4 py-3 text-left text-sm text-primary hover:bg-primary/10">＋ Create a new run</button><button onClick={() => setActiveTab("attendance")} className="border border-white/10 px-4 py-3 text-left text-sm text-offwhite/75 hover:border-primary">Manage attendance →</button><button onClick={() => setActiveTab("members")} className="border border-white/10 px-4 py-3 text-left text-sm text-offwhite/75 hover:border-primary">View paid members →</button><button onClick={() => setActiveTab("assistant")} className="border border-white/10 px-4 py-3 text-left text-sm text-offwhite/75 hover:border-primary">Edit chatbot answers →</button></div></div>
              </div>
            </>}
          </div>
        )}

        {activeTab === "runs" && (
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <form onSubmit={saveRun} className="h-fit border border-white/10 bg-[#1b201c] p-5">
              <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.16em] text-primary">{editingRunId ? "Update details" : "Run planning"}</p><h2 className="mt-1 font-display text-2xl font-semibold text-white">{editingRunId ? "Edit run" : "Create a run"}</h2></div>{editingRunId && <button type="button" onClick={resetRunForm} className="text-xs text-offwhite/55 underline">Cancel</button>}</div>
              <div className="space-y-4">
                <Field label="Run title"><input required maxLength={100} value={runForm.title} onChange={(e) => setRunForm({ ...runForm, title: e.target.value })} className={inputClass} placeholder="Sunday community run" /></Field>
                <Field label="Description"><textarea rows={3} maxLength={1000} value={runForm.description} onChange={(e) => setRunForm({ ...runForm, description: e.target.value })} className={inputClass} placeholder="A short note for runners…" /></Field>
                <div className="grid grid-cols-2 gap-3"><Field label="Date"><input required type="date" value={runForm.date} onChange={(e) => setRunForm({ ...runForm, date: e.target.value })} className={inputClass} /></Field><Field label="Start time"><input required type="time" value={runForm.startTime} onChange={(e) => setRunForm({ ...runForm, startTime: e.target.value })} className={inputClass} /></Field></div>
                <div className="grid grid-cols-2 gap-3"><Field label="Distance (KM)"><input type="number" min="0.1" step="0.1" value={runForm.distance} onChange={(e) => setRunForm({ ...runForm, distance: e.target.value })} className={inputClass} placeholder="5" /></Field><Field label="Max participants"><input type="number" min="1" step="1" value={runForm.maxParticipants} onChange={(e) => setRunForm({ ...runForm, maxParticipants: e.target.value })} className={inputClass} placeholder="No limit" /></Field></div>
                <Field label="Meeting point"><input value={runForm.locationName} onChange={(e) => setRunForm({ ...runForm, locationName: e.target.value })} className={inputClass} placeholder="Park / meeting point" /></Field>
                <Field label="Address"><input value={runForm.locationAddress} onChange={(e) => setRunForm({ ...runForm, locationAddress: e.target.value })} className={inputClass} placeholder="Full address" /></Field>
                {editingRunId && <Field label="Run status"><select value={runForm.status} onChange={(e) => setRunForm({ ...runForm, status: e.target.value })} className={inputClass}>{["upcoming", "ongoing", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>}
                <button disabled={runSaving} className="w-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">{runSaving ? "Saving…" : editingRunId ? "Save run changes" : "Create run"}</button>
              </div>
            </form>

            <div>
              <div className="mb-4 space-y-3">
                <input value={runSearch} onChange={(e) => setRunSearch(e.target.value)} placeholder="Search runs by title or location…" className={inputClass} />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[{ id: "all", label: "All" }, { id: "upcoming", label: "Upcoming" }, { id: "ongoing", label: "Ongoing" }, { id: "completed", label: "Completed" }, { id: "cancelled", label: "Cancelled" }].map((item) => {
                    const count = item.id === "all" ? runs.length : runs.filter((run) => run.status === item.id).length;
                    return <button key={item.id} type="button" onClick={() => setRunStatusFilter(item.id)} className={`border px-3 py-2 text-left transition ${runStatusFilter === item.id ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-[#1b201c] text-offwhite/60 hover:border-white/25"}`}>
                      <span className="block text-xs font-semibold">{item.label}</span><span className="mt-0.5 block text-[11px] opacity-65">{count} runs</span>
                    </button>;
                  })}
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-white">All runs</h2><button onClick={fetchRuns} className="text-xs text-primary hover:underline">Refresh</button></div>
              {runsLoading ? <p className="py-10 text-center text-sm text-offwhite/50">Loading runs…</p> : filteredRuns.length === 0 ? <div className="border border-white/10 py-12 text-center text-sm text-offwhite/45">No runs match this filter.</div> : <div className="space-y-3">{filteredRuns.map((run) => <article key={run._id} className="border border-white/10 bg-[#1b201c] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-lg font-semibold text-white">{run.title}</h3><span className={`border px-2 py-0.5 text-[10px] uppercase tracking-wide ${run.status === "upcoming" ? "border-sky-400/30 text-sky-300" : run.status === "ongoing" ? "border-primary/40 text-primary" : run.status === "completed" ? "border-emerald-400/30 text-emerald-300" : "border-red-400/30 text-red-300"}`}>{run.status || "upcoming"}</span></div><p className="mt-1 text-xs text-offwhite/50">{formatDate(run.date)} · {run.startTime} · {run.distance ? `${run.distance} KM` : "Distance not set"}</p><p className="mt-2 text-xs text-offwhite/45">{run.location?.name || "Location not set"} {run.location?.address ? `· ${run.location.address}` : ""}</p><p className="mt-2 text-xs text-offwhite/60">{run.registrationCount || 0} registrations{run.maxParticipants ? ` / ${run.maxParticipants} spots` : ""}</p></div><div className="flex shrink-0 flex-wrap gap-2">
                    <select aria-label={`Change status for ${run.title}`} value={run.status || "upcoming"} onChange={async (event) => {
                      const nextStatus = event.target.value;
                      try {
                        await updateAdminRun(run._id, { status: nextStatus });
                        setNotice(`Run marked as ${nextStatus}.`);
                        setError("");
                        await fetchRuns();
                      } catch (err) { setError(err.response?.data?.message || "Could not change run status"); }
                    }} className="border border-white/15 bg-[#171b18] px-2 py-2 text-xs text-white outline-none focus:border-primary">
                      {["upcoming", "ongoing", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                    </select>
                    <button onClick={() => startEditRun(run)} className="border border-white/15 px-3 py-2 text-xs text-white hover:border-primary">Edit</button>
                    <button onClick={() => removeRun(run)} className="border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
                  </div></div>
              </article>)}</div>}
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold text-white">Attendance management</h2><p className="mt-1 text-sm text-offwhite/45">Update runner check-ins for the selected date.</p></div><button onClick={fetchDashboard} className="border border-white/15 px-3 py-2 text-xs text-offwhite/70 hover:border-primary">Refresh</button></div>
            {loading ? <p className="py-10 text-center text-sm text-offwhite/50">Loading attendance…</p> : <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-2">{dashboard.attendance.length ? dashboard.attendance.map((entry) => <article key={entry._id} className="border border-white/10 bg-[#1b201c] p-4"><button type="button" onClick={() => setSelectedAttendanceId(entry._id)} className="mb-2 text-xs text-primary hover:underline">View runner details</button><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-white">{entry.user?.name || "Unknown runner"}</p><p className="text-xs text-offwhite/45">{entry.user?.email || "No email"} · {entry.run?.title || "Run"}</p><p className="mt-1 text-xs capitalize text-primary">Status: {entry.status}</p></div><div className="flex gap-2"><button disabled={saving[entry._id]} onClick={() => handleStatusUpdate(entry._id, "present")} className="bg-primary px-3 py-2 text-xs text-white disabled:opacity-50">Present</button><button disabled={saving[entry._id]} onClick={() => handleStatusUpdate(entry._id, "absent")} className="border border-white/15 px-3 py-2 text-xs text-offwhite/75 disabled:opacity-50">Absent</button><button disabled={saving[entry._id]} onClick={() => handleStatusUpdate(entry._id, "registered")} className="border border-white/15 px-3 py-2 text-xs text-offwhite/75 disabled:opacity-50">Registered</button></div></div></article>) : <p className="border border-white/10 py-12 text-center text-sm text-offwhite/45">No attendance records for this date.</p>}</div>
              <aside className="h-fit border border-white/10 bg-[#1b201c] p-5"><h3 className="font-display text-xl font-semibold text-white">Runner details</h3>{selectedAttendance ? <div className="mt-4 space-y-3 text-sm"><p className="text-lg font-semibold text-primary">{selectedAttendance.user?.name || "Unknown runner"}</p><p className="text-offwhite/60">{selectedAttendance.user?.email || "—"}</p><div className="border-t border-white/10 pt-3"><p className="text-xs text-offwhite/40">City</p><p className="text-white">{selectedAttendance.user?.city || "—"}</p></div><div><p className="text-xs text-offwhite/40">Emergency contact</p><p className="text-white">{selectedAttendance.user?.emergencyContact?.phone || "—"}</p></div><div><p className="text-xs text-offwhite/40">Run</p><p className="text-white">{selectedAttendance.run?.title || "—"}</p></div></div> : <p className="mt-3 text-sm text-offwhite/45">Select a runner from the list.</p>}</aside>
            </div>}
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="font-display text-2xl font-semibold text-white">Member subscriptions</h2><p className="mt-1 text-sm text-offwhite/45">Latest subscription for every account, including expired and cancelled plans.</p></div>
              <button type="button" onClick={fetchDashboard} className="border border-white/15 px-3 py-2 text-xs text-offwhite/70 hover:border-primary">Refresh records</button>
            </div>
            {loading ? <p className="py-10 text-center text-sm text-offwhite/50">Loading member records…</p> : (
              <div className="space-y-3">
                {[...(dashboard.memberSubscriptions || [])]
                  .sort((a, b) => {
                    const rank = (record) => {
                      const status = record.latestSubscription?.effectiveStatus;
                      if (status === "active") return 0;
                      if (status === "expired") return 1;
                      if (!record.latestSubscription) return 3;
                      return 2;
                    };
                    const order = rank(a) - rank(b);
                    if (order !== 0) return order;
                    return (a.user?.name || "").localeCompare(b.user?.name || "");
                  })
                  .map((record) => {
                  const membership = record.latestSubscription;
                  const status = membership?.effectiveStatus || "never subscribed";
                  const statusClass = status === "active" ? "text-primary border-primary/30" : status === "expired" ? "text-amber-300 border-amber-400/30" : status === "cancelled" ? "text-red-300 border-red-400/30" : status === "pending" ? "text-sky-300 border-sky-400/30" : "text-offwhite/45 border-white/15";
                  const isExpanded = expandedMemberId === record.user._id;
                  return <article key={record.user._id} className="border border-white/10 bg-[#1b201c] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        {record.user.profilePicture ? <img src={record.user.profilePicture} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">{(record.user.name || "M").charAt(0).toUpperCase()}</div>}
                        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{record.user.name}</h3><span className={`border px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusClass}`}>{status}</span></div><p className="mt-1 truncate text-xs text-offwhite/45">{record.user.email} · {record.user.city || "City not set"}</p></div>
                      </div>
                      <button type="button" aria-expanded={isExpanded} onClick={() => setExpandedMemberId(isExpanded ? null : record.user._id)} className="flex shrink-0 items-center justify-center gap-2 border border-primary/40 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/10">{isExpanded ? "Hide details" : "View details"}<span aria-hidden="true">{isExpanded ? "↑" : "↓"}</span></button>
                    </div>
                    {isExpanded && <div className="mt-5 border-t border-white/10 pt-5">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">Member information</h4>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div><p className="text-[11px] text-offwhite/40">Full name</p><p className="mt-1 break-words text-sm text-white">{record.user.name || "—"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Email address</p><p className="mt-1 break-all text-sm text-white">{record.user.email || "—"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">City</p><p className="mt-1 text-sm text-white">{record.user.city || "—"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Account role</p><p className="mt-1 text-sm capitalize text-white">{record.user.role || "member"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Joined club</p><p className="mt-1 text-sm text-white">{formatDate(record.user.createdAt)}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">User ID</p><p className="mt-1 break-all text-xs text-offwhite/70">{record.user._id}</p></div>
                      </div>
                      <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-primary">Latest subscription</h4>
                      {membership ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div><p className="text-[11px] text-offwhite/40">Plan</p><p className="mt-1 text-sm font-medium capitalize text-white">{membership.plan}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Subscription status</p><p className="mt-1 text-sm capitalize text-white">{status}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Last payment amount</p><p className="mt-1 text-sm text-white">₹{membership.price ?? "—"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Start date</p><p className="mt-1 text-sm text-white">{formatDate(membership.startDate)}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Expiry / due date</p><p className="mt-1 text-sm text-white">{membership.endDate ? formatDate(membership.endDate) : membership.plan === "lifetime" ? "Lifetime" : "Not set"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Days remaining</p><p className="mt-1 text-sm text-white">{membership.endDate ? (status === "active" ? membership.daysRemaining : "0") : membership.plan === "lifetime" ? "Unlimited" : "—"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Auto renewal</p><p className="mt-1 text-sm text-white">{membership.autoRenew ? "Enabled" : "Disabled"}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Subscription record created</p><p className="mt-1 text-sm text-white">{formatDate(membership.createdAt)}</p></div>
                        <div><p className="text-[11px] text-offwhite/40">Subscription ID</p><p className="mt-1 break-all text-xs text-offwhite/70">{membership._id}</p></div>
                      </div> : <p className="border border-white/10 bg-black/10 p-4 text-sm text-offwhite/50">This user has not purchased a subscription yet.</p>}
                    </div>}
                  </article>;
                })}
                {(dashboard.memberSubscriptions || []).length === 0 && <p className="border border-white/10 py-10 text-center text-sm text-offwhite/45">No member accounts found.</p>}
              </div>
            )}
          </div>
        )}
        {activeTab === "assistant" && <ChatbotKnowledgeAdmin />}
      </div>
    </section>
  );
}
