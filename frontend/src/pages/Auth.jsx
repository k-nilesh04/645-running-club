import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, signupUser, sendLoginOtp, verifyLoginOtp } from "../api/api.js";
import EmailVerificationModal from "../components/EmailVerificationModal.jsx";
import { saveAuthSession } from "../utils/auth.js";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };
const strongPassword = (password) =>
  password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const inputClass = "w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-offwhite/35 focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/profile";
  const isSignup = mode === "signup";

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const timer = setTimeout(() => setOtpCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setStatus({ type: "", message: "" });
    setVerificationEmail("");
    setOtpSent(false);
    setLoginOtp("");
    setOtpCooldown(0);
    setLoginMethod("password");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isSignup && loginMethod === "otp") {
      if (!formData.email.trim()) {
        setStatus({ type: "error", message: "Enter your email address first." });
        return;
      }
      if (otpSent && !/^\\d{6}$/.test(loginOtp)) {
        setStatus({ type: "error", message: "Enter the 6-digit OTP sent to your email." });
        return;
      }
    }

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
    <section className="relative isolate overflow-hidden bg-dark px-5 py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(15,157,88,0.22),transparent_28%),radial-gradient(circle_at_88%_75%,rgba(255,213,79,0.1),transparent_23%)]" />
      {verificationEmail && <EmailVerificationModal email={verificationEmail} onVerified={() => navigate(redirectPath, { replace: true })} />}

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#1f1f1f] shadow-2xl shadow-black/30 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative overflow-hidden bg-primary p-8 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-white/10" />
          <div className="relative flex h-full flex-col">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white font-display text-sm font-extrabold text-primary">645</span>
            <div className="mt-16 lg:mt-auto">
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/75">Every Sunday</p>
              <h1 className="mt-4 max-w-sm font-display text-4xl font-bold leading-tight text-white">Your next good habit starts here.</h1>
              <p className="mt-5 max-w-sm leading-7 text-white/80">Create an account to manage your profile and register for upcoming club runs.</p>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-white/90">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Dwarka Sector 19B Park · 6:15 AM
            </div>
          </div>
        </aside>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8 flex rounded-xl bg-black/20 p-1">
            {["login", "signup"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeMode(item)}
                className={`flex-1 rounded-lg px-4 py-2.5 font-display text-sm font-semibold transition ${
                  mode === item ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-offwhite/55 hover:text-white"
                }`}
              >
                {item === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>

          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">{isSignup ? "New runner" : "Member access"}</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white">{isSignup ? "Join the club." : "Welcome back."}</h2>
          <p className="mt-3 text-sm leading-6 text-offwhite/60">
            {isSignup ? "Your email will be verified before your account is activated." : "Sign in to view your profile and registered runs."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-offwhite/75">Full name</span>
                <input type="text" name="name" autoComplete="name" placeholder="Your full name" value={formData.name} onChange={handleChange} minLength="2" maxLength="80" required className={inputClass} />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-offwhite/75">Email address</span>
              <input type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-offwhite/75">Password</span>
              <input type="password" name="password" autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "Create a secure password" : "Enter your password"} value={formData.password} onChange={handleChange} minLength={isSignup ? 12 : undefined} required className={inputClass} />
            </label>

            {isSignup && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-offwhite/75">Confirm password</span>
                  <input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} />
                </label>
                <p className="text-xs leading-5 text-offwhite/45">Use 12+ characters with an uppercase letter, lowercase letter, and number.</p>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait..." : isSignup ? "Create account" : loginMethod === "otp" ? (otpSent ? "Verify & log in" : "Send login OTP") : "Log in"}
            </button>
          </form>

          {status.message && (
            <p role="alert" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              status.type === "success" ? "border-primary/30 bg-primary/10 text-primary" : "border-red-400/25 bg-red-400/10 text-red-300"
            }`}>
              {status.message}
            </p>
          )}

          <p className="mt-7 text-center text-sm text-offwhite/50">
            {isSignup ? "Already part of the club?" : "New to 645 Run Club?"}{" "}
            <button type="button" onClick={() => changeMode(isSignup ? "login" : "signup")} className="font-semibold text-primary hover:text-white">
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
