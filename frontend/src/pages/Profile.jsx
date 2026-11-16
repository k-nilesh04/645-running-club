import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/api.js";

const initialProfile = {
  name: "", age: "", gender: "", city: "", profilePicture: "",
  emergencyContact: { name: "", phone: "", relation: "" },
};

function Field({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-white/75">{label}</span>
      <input {...props} className="w-full rounded-lg border border-white/15 bg-[#171b18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary" />
    </label>
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
          setProfile({ ...initialProfile, ...user, age: user.age || "", emergencyContact: { ...initialProfile.emergencyContact, ...(user.emergencyContact || {}) } });
          setStatus({ type: "", message: "" });
        }
      } catch (error) {
        if (isMounted) setStatus({ type: "error", message: error.response?.data?.message || "Login required to view profile" });
      } finally { if (isMounted) setLoading(false); }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setProfile((current) => ({ ...current, emergencyContact: { ...current.emergencyContact, [key]: value } }));
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
        name: profile.name, age: profile.age ? Number(profile.age) : undefined,
        gender: profile.gender || undefined, city: profile.city,
        profilePicture: profile.profilePicture, emergencyContact: profile.emergencyContact,
      };
      const { data } = await updateMyProfile(payload);
      setStatus({ type: "success", message: data.message || "Profile updated" });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Could not update profile" });
    } finally { setSaving(false); }
  };

  const initials = profile.name.trim() ? profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "645";

  if (loading) return <section className="section"><p className="text-sm text-offwhite/50">Loading your profile...</p></section>;

  return (
    <section className="section min-h-[60vh]">
      <div className="mb-8 border-b border-white/10 pb-7">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Member details</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Your profile<span className="text-primary">.</span></h1>
        <p className="mt-3 text-sm text-offwhite/55">Keep your information up to date.</p>
      </div>

      <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-7">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/10 text-lg font-bold text-primary">
          {profile.profilePicture ? <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : initials}
        </div>
        <div className="min-w-0"><h2 className="truncate font-display text-xl font-semibold text-white">{profile.name || "Your name"}</h2><p className="mt-1 text-sm text-offwhite/45">{profile.city || "Add your city"}{profile.age ? ` · ${profile.age} years` : ""}</p></div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-5 font-display text-lg font-semibold text-white">Personal information</h3>
            <div className="space-y-5">
              <Field label="Full name" name="name" type="text" placeholder="Your full name" value={profile.name} onChange={handleChange} autoComplete="name" required />
              <Field label="Age" name="age" type="number" min="1" max="120" placeholder="Your age" value={profile.age} onChange={handleChange} />
              <label className="block"><span className="mb-2 block text-sm font-medium text-white/75">Gender</span><select name="gender" value={profile.gender} onChange={handleChange} className="w-full rounded-lg border border-white/15 bg-[#171b18] px-4 py-3 text-sm text-white outline-none focus:border-primary"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
              <Field label="City" name="city" type="text" placeholder="Your city" value={profile.city} onChange={handleChange} autoComplete="address-level2" />
              <Field label="Profile photo URL" name="profilePicture" type="url" placeholder="https://example.com/photo.jpg" value={profile.profilePicture} onChange={handleChange} />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-display text-lg font-semibold text-white">Emergency contact</h3>
            <p className="mb-5 text-sm leading-6 text-offwhite/45">A person we can reach if you need help during a club run.</p>
            <div className="space-y-5">
              <Field label="Contact name" name="emergencyContact.name" type="text" placeholder="Full name" value={profile.emergencyContact.name} onChange={handleChange} />
              <Field label="Phone number" name="emergencyContact.phone" type="tel" placeholder="Phone number" value={profile.emergencyContact.phone} onChange={handleChange} />
              <Field label="Relationship" name="emergencyContact.relation" type="text" placeholder="Parent, friend, etc." value={profile.emergencyContact.relation} onChange={handleChange} />
            </div>
          </div>
        </div>

        {status.message && <div role="status" className={`mt-7 border-l-2 px-4 py-3 text-sm ${status.type === "success" ? "border-primary bg-primary/10 text-primary" : "border-red-400 bg-red-400/10 text-red-300"}`}>{status.message}</div>}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-offwhite/40">Your details are used for your 645 Run Club membership.</p>
          <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
        </div>
      </form>
    </section>
  );
}