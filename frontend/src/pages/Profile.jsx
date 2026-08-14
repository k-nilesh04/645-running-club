import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/api.js";

const initialProfile = {
  name: "",
  age: "",
  gender: "",
  city: "",
  profilePicture: "",
  emergencyContact: {
    name: "",
    phone: "",
    relation: "",
  },
};

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
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setProfile((current) => ({
        ...current,
        emergencyContact: {
          ...current.emergencyContact,
          [key]: value,
        },
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

  if (loading) {
    return <p className="section text-center text-offwhite/60">Loading profile...</p>;
  }

  return (
    <section className="section">
      <div className="max-w-2xl mx-auto card">
        <h1 className="font-display text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-offwhite/60 text-sm mb-6">
          Update the fields supported by the backend profile API.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={profile.name}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={profile.age}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={profile.city}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <input
            type="url"
            name="profilePicture"
            placeholder="Profile picture URL"
            value={profile.profilePicture}
            onChange={handleChange}
            className="md:col-span-2 bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            name="emergencyContact.name"
            placeholder="Emergency contact name"
            value={profile.emergencyContact.name}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <input
            type="tel"
            name="emergencyContact.phone"
            placeholder="Emergency contact phone"
            value={profile.emergencyContact.phone}
            onChange={handleChange}
            className="bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            name="emergencyContact.relation"
            placeholder="Relation"
            value={profile.emergencyContact.relation}
            onChange={handleChange}
            className="md:col-span-2 bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />

          <button type="submit" disabled={saving} className="btn-primary md:col-span-2">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {status.message && (
          <p
            className={`text-sm text-center mt-4 ${
              status.type === "success" ? "text-primary" : "text-red-400"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
