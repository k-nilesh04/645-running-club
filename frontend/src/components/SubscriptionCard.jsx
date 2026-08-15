import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { initiatePayment, verifyPayment, getMembershipStatus } from "../api/api.js";
import { isLoggedIn } from "../utils/auth.js";

const perks = [
  "Sunday Runs",
  "Community Support",
  "Fitness Tracking",
  "Weekly Motivation",
  "Weekly Challenges",
];

const swags = ["Running T-Shirt", "Wrist Band", "and many more..."];

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    const script = existingScript || document.createElement("script");

    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Could not load the payment gateway. Check your connection."))
    );

    if (!existingScript) {
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

export default function SubscriptionCard() {
  const [formData, setFormData] = useState({
    tshirtSize: "M",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [hasMembership, setHasMembership] = useState(false);
  const [membershipData, setMembershipData] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      checkMembershipStatus();
    }
  }, []);

  const checkMembershipStatus = async () => {
    try {
      const { data } = await getMembershipStatus();
      if (data.hasMembership) {
        setHasMembership(true);
        setMembershipData(data.membership);
      }
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      setStatus({
        state: "error",
        message: "Please login first to subscribe",
      });
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

    if (!razorpayKey) {
      setStatus({
        state: "error",
        message: "Payments are not configured yet. Please try again later.",
      });
      return;
    }

    setLoading(true);
    setStatus({ state: "idle", message: "" });

    try {
      const { data } = await initiatePayment({ plan: "monthly" });
      const paymentId = data.payment.id;
      const membershipId = data.membership;

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: data.payment.amount * 100, // Razorpay expects paise
        currency: data.payment.currency || "INR",
        name: "645 Run Club",
        description: "Monthly Subscription",
        handler: async (response) => {
          try {
            const verifyData = await verifyPayment({
              paymentId,
              membershipId,
              transactionId: response.razorpay_payment_id,
            });

            if (verifyData.data.success) {
              setStatus({
                state: "success",
                message: "Payment successful! Welcome to 645 Run Club Premium.",
              });
              setHasMembership(true);
              setMembershipData(verifyData.data.membership);
              setFormData({ tshirtSize: "M" });
            }
          } catch (error) {
            setStatus({
              state: "error",
              message: "Payment verification failed. Please try again.",
            });
          }
        },
        prefill: {
          name: storedUser().name || "",
          email: storedUser().email || "",
        },
        theme: {
          color: "#0F9D58",
        },
      });

      rzp.open();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Could not initiate payment. Try again.";
      setStatus({ state: "error", message });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="card max-w-md mx-auto border-primary/30">
        <h3 className="font-display text-2xl font-bold text-white mb-4">
          Join Premium
        </h3>
        <p className="text-offwhite/70 mb-6">
          Please log in to access our premium membership plans and exclusive benefits.
        </p>
        <Link to="/auth" className="btn-primary w-full text-center">
          Login to Subscribe
        </Link>
      </div>
    );
  }

  if (hasMembership && membershipData) {
    return (
      <div className="card max-w-md mx-auto border-primary/30">
        <div className="flex justify-center items-center p-1 mb-4 border border-green-200 rounded-lg">
          <h3 className="font-display text-2xl font-bold text-green-500 text-center">
            ✓ Premium Member
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
            <p className="text-sm text-offwhite/60 mb-2">Plan</p>
            <p className="font-display font-semibold text-white capitalize">
              {membershipData.plan}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark border border-white/10 p-4 rounded-lg">
              <p className="text-xs text-offwhite/60 mb-1">Active Since</p>
              <p className="text-sm text-white font-semibold">
                {new Date(membershipData.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-dark border border-white/10 p-4 rounded-lg">
              <p className="text-xs text-offwhite/60 mb-1">Expires</p>
              <p className="text-sm text-white font-semibold">
                {membershipData.endDate
                  ? new Date(membershipData.endDate).toLocaleDateString()
                  : "Lifetime"}
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-offwhite/90">
                <span className="text-green-500 text-xs font-bold">✓</span> {perk}
              </li>
            ))}
          </ul>
        </div>

        {status.message && (
          <p className="text-sm mt-4 text-center text-primary">{status.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-300">
      <div className="flex justify-center items-center p-1 mb-4 border border-yellow-200 rounded-lg">
        <h3 className="font-display text-2xl font-bold text-yellow-500 text-center">
          ₹299 One Time Payment
        </h3>
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-2xl font-bold text-white">Rs 99</h3>
        <span className="text-offwhite/60 text-sm">/ month</span>
      </div>

      <ul className="space-y-2 mb-4">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-offwhite/90">
            <span className="text-primary text-xs font-bold">✓</span> {perk}
          </li>
        ))}
      </ul>

      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4">
        <p className="font-display font-semibold text-accent mb-2">Club Swags</p>
        <ul className="space-y-1">
          {swags.map((swag) => (
            <li key={swag} className="flex items-center gap-2 text-sm text-offwhite/90">
              <span className="text-accent text-xs font-bold">✓</span> {swag}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Processing..." : "Subscribe Now"}
        </button>
      </form>

      {status.message && (
        <p
          className={`text-md mt-3 text-center ${
            status.state === "success" ? "text-primary" : "text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
