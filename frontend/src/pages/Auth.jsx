import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/api.js";
import EmailVerificationModal from "../components/EmailVerificationModal.jsx";
import { saveAuthSession } from "../utils/auth.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/profile";

  const isSignup = mode === "signup";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };
      const { data } = isSignup ? await signupUser(payload) : await loginUser(payload);

      setStatus({
        type: "success",
        message: data.message || "Success",
      });

      if (isSignup && data.requiresEmailVerification) {
        setVerificationEmail(data.user?.email || formData.email);
        return;
      }

      saveAuthSession({ token: data.token, user: data.user });
      navigate(redirectPath);
    } catch (error) {
      console.error("Auth Error:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      {verificationEmail && (
        <EmailVerificationModal
          email={verificationEmail}
          onVerified={() => navigate(redirectPath)}
        />
      )}

      <div className="max-w-md mx-auto card">
        <div className="flex gap-2 mb-6 rounded-full bg-dark p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setStatus({ type: "", message: "" });
                setVerificationEmail("");
              }}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-display font-semibold transition-colors ${
                mode === item
                  ? "bg-primary text-white"
                  : "text-offwhite/70 hover:text-white"
              }`}
            >
              {item === "login" ? "Login" : "Signup"}
            </button>
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-offwhite/60 text-sm mb-6">
          {isSignup
            ? "Join 645 Run Club with your name, email, and password."
            : "Login with your registered email and password."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
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
