import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard, updateAttendanceStatus } from "../api/api.js";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [dashboard, setDashboard] = useState({
    summary: {
      totalUsers: 0,
      presentCount: 0,
      registeredCount: 0,
      absentCount: 0,
      paidMembersCount: 0,
    },
    attendance: [],
    paidMembers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [saving, setSaving] = useState({});

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAdminDashboard(selectedDate);
      setDashboard(data);
      setSelectedAttendanceId((current) => {
        if (data.attendance.length === 0) return null;
        if (current && data.attendance.some((entry) => entry._id === current)) {
          return current;
        }
        return data.attendance[0]._id;
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate]);

  const selectedAttendance = useMemo(() => {
    if (!dashboard.attendance.length) return null;
    return (
      dashboard.attendance.find((entry) => entry._id === selectedAttendanceId) || dashboard.attendance[0]
    );
  }, [dashboard.attendance, selectedAttendanceId]);

  const handleStatusUpdate = async (attendanceId, status) => {
    setSaving((current) => ({ ...current, [attendanceId]: true }));

    try {
      await updateAttendanceStatus(attendanceId, status, new Date().toISOString());
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update attendance");
    } finally {
      setSaving((current) => ({ ...current, [attendanceId]: false }));
    }
  };

  return (
    <section className="section">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-2">Admin dashboard</p>
            <h1 className="font-display text-4xl font-bold text-white">Daily attendance overview</h1>
          </div>

          <label className="flex flex-col text-sm text-offwhite/70">
            Select date
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-2 bg-[#232323] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card text-center text-offwhite/60">Loading attendance data...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <p className="text-offwhite/60 text-sm">Total users</p>
                <p className="font-display text-3xl font-bold text-white mt-2">
                  {dashboard.summary.totalUsers}
                </p>
              </div>
              <div className="card">
                <p className="text-offwhite/60 text-sm">Present</p>
                <p className="font-display text-3xl font-bold text-primary mt-2">
                  {dashboard.summary.presentCount}
                </p>
              </div>
              <div className="card">
                <p className="text-offwhite/60 text-sm">Registered</p>
                <p className="font-display text-3xl font-bold text-white mt-2">
                  {dashboard.summary.registeredCount}
                </p>
              </div>
              <div className="card">
                <p className="text-offwhite/60 text-sm">Paid members</p>
                <p className="font-display text-3xl font-bold text-white mt-2">
                  {dashboard.summary.paidMembersCount}
                </p>
              </div>
            </div>

            <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl font-bold text-white">Users on this day</h2>
                  <span className="text-sm text-offwhite/60">{dashboard.attendance.length} records</span>
                </div>

                <div className="space-y-3">
                  {dashboard.attendance.length === 0 ? (
                    <p className="text-offwhite/60 py-6 text-center">No attendance recorded for this date.</p>
                  ) : (
                    dashboard.attendance.map((entry) => {
                      const isSelected = selectedAttendance && selectedAttendance._id === entry._id;
                      const user = entry.user || {};

                      return (
                        <button
                          key={entry._id}
                          type="button"
                          onClick={() => setSelectedAttendanceId(entry._id)}
                          className={`w-full text-left rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-white/10 bg-dark/40 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="font-display text-lg font-semibold text-white">{user.name || "Unknown user"}</p>
                              <p className="text-sm text-offwhite/60">{user.email || "No email"}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                                {entry.status || "registered"}
                              </span>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleStatusUpdate(entry._id, "present");
                                }}
                                disabled={saving[entry._id]}
                                className="bg-primary text-white text-xs px-3 py-1.5 rounded-full disabled:opacity-60"
                              >
                                {saving[entry._id] ? "Updating..." : "Present"}
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleStatusUpdate(entry._id, "absent");
                                }}
                                disabled={saving[entry._id]}
                                className="border border-white/15 text-offwhite/80 text-xs px-3 py-1.5 rounded-full disabled:opacity-60"
                              >
                                Absent
                              </button>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="card">
                <h2 className="font-display text-2xl font-bold text-white mb-4">User details</h2>

                {selectedAttendance ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                        {(selectedAttendance.user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display text-xl text-white">{selectedAttendance.user?.name || "Unknown user"}</p>
                        <p className="text-sm text-offwhite/60">{selectedAttendance.user?.email || "No email"}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm">
                      <div className="bg-dark/40 rounded-lg p-3">
                        <p className="text-offwhite/50 mb-1">City</p>
                        <p className="text-white">{selectedAttendance.user?.city || "N/A"}</p>
                      </div>
                      <div className="bg-dark/40 rounded-lg p-3">
                        <p className="text-offwhite/50 mb-1">Gender</p>
                        <p className="text-white">{selectedAttendance.user?.gender || "N/A"}</p>
                      </div>
                      <div className="bg-dark/40 rounded-lg p-3">
                        <p className="text-offwhite/50 mb-1">Contact</p>
                        <p className="text-white">{selectedAttendance.user?.emergencyContact.phone || "N/A"}</p>
                      </div>
                      <div className="bg-dark/40 rounded-lg p-3">
                        <p className="text-offwhite/50 mb-1">Run</p>
                        <p className="text-white">{selectedAttendance.run?.title || "No run"}</p>
                      </div>
                      <div className="bg-dark/40 rounded-lg p-3">
                        <p className="text-offwhite/50 mb-1">Attendance status</p>
                        <p className="text-white uppercase">{selectedAttendance.status}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-offwhite/60">Select a user to view details.</p>
                )}
              </div>
            </div>

            <div className="mt-10 card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-bold text-white">Paid members</h2>
                <span className="text-sm text-offwhite/60">{dashboard.paidMembers.length} active subscriptions</span>
              </div>

              {dashboard.paidMembers.length === 0 ? (
                <p className="text-offwhite/60 py-4 text-center">No paid members found.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {dashboard.paidMembers.map((membership) => (
                    <div key={membership._id} className="bg-dark/40 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between gap-2 mb-3">
                        <div>
                          <p className="font-display text-lg text-white">{membership.user?.name || "Unknown member"}</p>
                          <p className="text-sm text-offwhite/60">{membership.user?.email || "No email"}</p>
                        </div>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
                          {membership.plan}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-offwhite/70">
                        <div>
                          <p className="text-offwhite/50">Price</p>
                          <p className="text-white">₹{membership.price}</p>
                        </div>
                        <div>
                          <p className="text-offwhite/50">Status</p>
                          <p className="text-white uppercase">{membership.status}</p>
                        </div>
                        <div>
                          <p className="text-offwhite/50">Start</p>
                          <p className="text-white">{formatDate(membership.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-offwhite/50">End</p>
                          <p className="text-white">{membership.endDate ? formatDate(membership.endDate) : "Lifetime"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
