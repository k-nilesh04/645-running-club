import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/api.js";

const initialProfile = {
  name: "",
  age: "",
  gender: "",
  city: "",
  profilePicture: "",
  emergencyContact: { name: "", phone: "", relation: "" },
};

function Field({ label, hint, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-white/85">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-[#101b1a] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/10"
      />
      {hint && <span className="mt-1.5 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">{eyebrow}</p>
      <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/45">{description}</p>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const { data } = await getMyProfile();
        const user = data.user || {};
        if (isMounted) {
          setProfile({
            ...initialProfile,
            ...user,
            age: user.age || "",
            emergencyContact: {
              ...initialProfile.emergencyContact,
              ...(user.emergencyContact || {}),
            },
          });
          setStatus({ type: "", message: "" });
        }
      } catch (error) {
        if (isMounted) {
          setStatus({
            type: "error",
            message: error.response?.data?.message || "Login required to view profile",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setProfile((current) => ({
        ...current,
        emergencyContact: { ...current.emergencyContact, [key]: value },
      }));
      return;
    }
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const payload = {
        name: profile.name,
        age: profile.age ? Number(profile.age) : undefined,
        gender: profile.gender || undefined,
        city: profile.city,
        profilePicture: profile.profilePicture,
        emergencyContact: profile.emergencyContact,
      };
      const { data } = await updateMyProfile(payload);
      setStatus({ type: "success", message: data.message || "Profile updated" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name.trim()
    ? profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
    : "645";

  if (loading) {
    return (
      <section className="section">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl border border-white/10 bg-[#12201d] p-8">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="mt-5 h-10 w-64 rounded bg-white/10" />
          <div className="mt-8 h-48 rounded-2xl bg-white/5" />
          <div className="mt-5 h-64 rounded-2xl bg-white/5" />
        </div>
      </section>
    );
  }

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-lime-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 top-96 h-72 w-72 rounded-full bg-emerald-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-200">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> Runner dashboard
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">Your profile<span className="text-lime-300">.</span></h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">Make it yours. Keep your runner details and emergency information up to date.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="h-2 w-2 rounded-full bg-lime-300" /> 645 Run Club member space
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#12201d] shadow-2xl shadow-black/20">
          <div className="relative h-28 overflow-hidden bg-gradient-to-r from-lime-300/20 via-emerald-400/10 to-transparent sm:h-36">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9f99d 1px, transparent 0)", backgroundSize: "18px 18px" }} />
            <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-lime-200/10" />
            <div className="absolute -right-1 -top-14 h-44 w-44 rounded-full border border-lime-200/10" />
          </div>
          <div className="relative flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
            <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#12201d] bg-lime-300 text-2xl font-black text-[#14201b] shadow-xl">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              ) : initials}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300/80">Your runner identity</p>
              <h2 className="mt-1 truncate text-2xl font-extrabold text-white">{profile.name || "Welcome, runner"}</h2>
              <p className="mt-1 text-sm text-white/45">{profile.city || "Add your city"}{profile.age ? ` · ${profile.age} years` : ""}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-w-36">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Club</p>
              <p className="mt-1 text-sm font-bold text-white">645 Run Club</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="rounded-3xl border border-white/10 bg-[#12201d] p-5 shadow-xl shadow-black/10 sm:p-7">
              <SectionHeading eyebrow="01 / About you" title="Personal details" description="The basics that help your club community know you." />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" type="text" placeholder="Your full name" value={profile.name} onChange={handleChange} autoComplete="name" required />
                <Field label="Age" name="age" type="number" min="1" max="120" placeholder="Your age" value={profile.age} onChange={handleChange} />
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/85">Gender</span>
                  <select name="gender" value={profile.gender} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-[#101b1a] px-4 py-3.5 text-sm text-white outline-none transition focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/10">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <Field label="City" name="city" type="text" placeholder="Where do you run?" value={profile.city} onChange={handleChange} autoComplete="address-level2" />
                <Field className="sm:col-span-2" label="Profile photo URL" name="profilePicture" type="url" placeholder="https://example.com/your-photo.jpg" value={profile.profilePicture} onChange={handleChange} hint="Paste a public image URL to personalise your runner card." />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12201d] p-5 shadow-xl shadow-black/10 sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-xl">✦</div>
              <SectionHeading eyebrow="02 / Stay safe" title="Emergency contact" description="Someone the club can reach if you need help during a run." />
              <div className="space-y-5">
                <Field label="Contact person" name="emergencyContact.name" type="text" placeholder="Full name" value={profile.emergencyContact.name} onChange={handleChange} />
                <Field label="Phone number" name="emergencyContact.phone" type="tel" placeholder="Contact phone" value={profile.emergencyContact.phone} onChange={handleChange} />
                <Field label="Relationship" name="emergencyContact.relation" type="text" placeholder="e.g. Parent, sibling, friend" value={profile.emergencyContact.relation} onChange={handleChange} />
              </div>
              <div className="mt-6 rounded-xl border border-amber-200/10 bg-amber-200/[0.04] p-3.5 text-xs leading-5 text-white/45">
                Your emergency contact details are used only to support member safety.
              </div>
            </div>
          </div>

          {status.message && (
            <div role="status" className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${status.type === "success" ? "border-lime-300/20 bg-lime-300/10 text-lime-200" : "border-red-400/20 bg-red-400/10 text-red-300"}`}>
              <span className="text-base">{status.type === "success" ? "✓" : "!"}</span>
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/35">Your details are saved securely to your member profile.</p>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-3.5 text-sm font-extrabold text-[#14201b] shadow-lg shadow-lime-300/10 transition hover:-translate-y-0.5 hover:bg-lime-200 hover:shadow-lime-300/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
              {saving ? "Saving changes..." : "Save profile"}
              {!saving && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
