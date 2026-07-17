import { useState } from "react";
import { subscribeUser } from "../api/api.js";

const perks = [
  "Sunday Runs",
  "Community Support",
  "Fitness Tracking",
  "Weekly Motivation",
  "Priority Registration",
];

const swags = ["Running T-Shirt", "Wrist Band", "Sticker Pack"];

export default function SubscriptionCard() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", tshirtSize: "M" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const { data } = await subscribeUser(formData);
      setStatus({ state: "success", message: data.message || "You're in! Welcome, Premium Runner." });
      setFormData({ name: "", email: "", phone: "", tshirtSize: "M" });
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again in a moment.";
      setStatus({ state: "error", message });
    }
  };

  return (
    <div id="subscribe" className="card max-w-md mx-auto border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-300">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-2xl font-bold text-white">Rs 299</h3>
        <span className="text-offwhite/60 text-sm">/ month</span>
      </div>

      <ul className="space-y-2 mb-4">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-offwhite/90">
            <span className="text-primary text-xs font-bold" aria-hidden="true">OK</span> {perk}
          </li>
        ))}
      </ul>

      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4">
        <p className="font-display font-semibold text-accent mb-2">Free Club Swags</p>
        <ul className="space-y-1">
          {swags.map((swag) => (
            <li key={swag} className="flex items-center gap-2 text-sm text-offwhite/90">
              <span className="text-accent text-xs font-bold" aria-hidden="true">OK</span> {swag}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone number (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
        />
        <select
          name="tshirtSize"
          value={formData.tshirtSize}
          onChange={handleChange}
          className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
        >
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <option key={size} value={size}>
              T-Shirt Size: {size}
            </option>
          ))}
        </select>

        <button type="submit" disabled={status.state === "loading"} className="btn-primary w-full">
          {status.state === "loading" ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>

      {status.message && (
        <p
          className={`text-sm mt-3 text-center ${
            status.state === "success" ? "text-primary" : "text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
