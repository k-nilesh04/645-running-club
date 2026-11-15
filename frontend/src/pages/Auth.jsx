import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/api.js";
import EmailVerificationModal from "../components/EmailVerificationModal.jsx";
import { saveAuthSession } from "../utils/auth.js";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };
const strongPassword = (password) =>
  password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

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

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignup && !strongPassword(formData.password)) {
      setStatus({ type: "error", message: "Use at least 12 characters with uppercase, lowercase, and a number." });
      return;
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = isSignup
        ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }
        : { email: formData.email.trim(), password: formData.password };
      const { data } = isSignup ? await signupUser(payload) : await loginUser(payload);

      if (isSignup && data.requiresEmailVerification) {
        setVerificationEmail(data.user?.email || formData.email);
        return;
      }

      saveAuthSession({ user: data.user });
      navigate(redirectPath, { replace: true });
    } catch (error) {
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
      {verificationEmail && <EmailVerificationModal email={verificationEmail} onVerified={() => navigate(redirectPath, { replace: true })} />}

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
              className={`flex-1 rounded-full px-4 py-2 text-sm font-display font-semibold transition-colors ${mode === item ? "bg-primary text-white" : "text-offwhite/70 hover:text-white"}`}
            >
              {item === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="text-offwhite/60 text-sm mb-6">
          {isSignup ? "Create an account, verify your email, and register for upcoming runs." : "Sign in to manage your profile and runs."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input type="text" name="name" autoComplete="name" placeholder="Full name" value={formData.name} onChange={handleChange} minLength="2" maxLength="80" required className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary" />
          )}
          <input type="email" name="email" autoComplete="email" placeholder="Email address" value={formData.email} onChange={handleChange} required className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary" />
          <input type="password" name="password" autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "Create a password" : "Password"} value={formData.password} onChange={handleChange} minLength={isSignup ? 12 : undefined} required className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary" />
          {isSignup && (
            <>
              <input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary" />
              <p className="text-xs leading-5 text-offwhite/50">Use 12+ characters with an uppercase letter, lowercase letter, and number.</p>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
          </button>
        </form>

        {status.message && <p role="alert" className={`text-sm text-center mt-4 ${status.type === "success" ? "text-primary" : "text-red-400"}`}>{status.message}</p>}
      </div>
    </section>
  );
}
