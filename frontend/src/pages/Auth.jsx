import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, signupUser, sendLoginOtp, verifyLoginOtp } from "../api/api.js";
import EmailVerificationModal from "../components/EmailVerificationModal.jsx";
import { saveAuthSession } from "../utils/auth.js";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };
const passwordRules = [
  { label: "At least 12 characters", test: (value) => value.length >= 12 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "One number", test: (value) => /\d/.test(value) },
];
const inputClass = "w-full rounded-xl border border-white/10 bg-[#0b1811] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#a9e66e] focus:ring-2 focus:ring-[#a9e66e]/15";
const labelClass = "mb-2 block text-sm font-semibold text-white/80";

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0112 5c5.2 0 9 5.2 9 7a9.8 9.8 0 01-3.1 4.3M6.2 6.2C4.2 7.5 3 10 3 12c0 1.8 3.8 7 9 7 1.3 0 2.5-.3 3.5-.8"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true"><path d="M2.5 12s3.4-7 9.5-7 9.5 7 9.5 7-3.4 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

function PasswordField({ label, name, value, onChange, autoComplete, placeholder, error }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="relative block">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className={inputClass + " pr-14"}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-white/45 transition hover:text-[#a9e66e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a9e66e]"
        >
          <EyeIcon visible={visible} />
        </button>
      </span>
    </label>
  );
}

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
  const [mascotMood, setMascotMood] = useState("ready");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/profile";
  const isSignup = mode === "signup";
  const passwordValid = passwordRules.every((rule) => rule.test(formData.password));

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const timer = setTimeout(() => setOtpCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetOtp = () => {
    setOtpSent(false);
    setLoginOtp("");
    setOtpCooldown(0);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setStatus({ type: "", message: "" });
    setVerificationEmail("");
    resetOtp();
    setLoginMethod("password");
  };

  const changeLoginMethod = (nextMethod) => {
    setLoginMethod(nextMethod);
    resetOtp();
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!formData.email.trim()) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }
    if (isSignup && !passwordValid) {
      setStatus({ type: "error", message: "Please meet all password requirements before continuing." });
      return;
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Your passwords do not match. Please check and try again." });
      return;
    }
    if (!isSignup && loginMethod === "otp" && otpSent && !/^\d{6}$/.test(loginOtp)) {
      setStatus({ type: "error", message: "Enter the 6-digit code sent to your email." });
      return;
    }

    setLoading(true);
    try {
      if (!isSignup && loginMethod === "otp") {
        if (!otpSent) {
          const { data } = await sendLoginOtp(formData.email.trim());
          setOtpSent(true);
          setOtpCooldown(60);
          setStatus({ type: "success", message: data.message || "Your login code is on its way." });
          return;
        }
        const { data } = await verifyLoginOtp({ email: formData.email.trim(), otp: loginOtp });
        saveAuthSession({ user: data.user });
        navigate(redirectPath, { replace: true });
        return;
      }

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
        message: error.response?.data?.message || error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailInput = (
    <label className="block">
      <span className={labelClass}>Email address</span>
      <input
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(event) => {
          handleChange(event);
          if (otpSent) resetOtp();
        }}
        required
        maxLength={254}
        className={inputClass}
      />
    </label>
  );

  return (
    <section className="auth-page-motion relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-dark px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_8%,rgba(169,230,110,.13),transparent_34%),radial-gradient(ellipse_at_92%_90%,rgba(65,112,65,.12),transparent_35%)]" />
      {verificationEmail && (
        <EmailVerificationModal
          email={verificationEmail}
          onVerified={() => navigate(redirectPath, { replace: true })}
        />
      )}

      <div className="auth-card-motion mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1b14] shadow-[0_28px_100px_rgba(0,0,0,.42)] lg:grid-cols-[.92fr_1.08fr]">
        <aside
          className="auth-brand-motion auth-mascot-stage relative hidden min-h-[660px] flex-col justify-between overflow-hidden bg-[#a9e66e] p-10 text-[#0b160f] lg:flex xl:p-12"
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
            event.currentTarget.style.setProperty("--mascot-look-x", `${Math.max(-1, Math.min(1, x)) * 5}px`);
            event.currentTarget.style.setProperty("--mascot-look-y", `${Math.max(-1, Math.min(1, y)) * 3}px`);
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--mascot-look-x", "0px");
            event.currentTarget.style.setProperty("--mascot-look-y", "0px");
            setMascotMood("ready");
          }}
        >
          <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border-[52px] border-[#0b160f]/[.07]" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border-[44px] border-[#0b160f]/[.07]" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0b160f] font-display text-lg font-black text-[#a9e66e]">645</span>
            <span className="font-display text-sm font-extrabold uppercase tracking-[.16em]">Run Club</span>
          </div>
          <div className="relative py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0b160f]/15 bg-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em]">
              <span className="h-2 w-2 rounded-full bg-[#0b160f]" /> Every Sunday · 6:15 AM
            </span>
            <h1 className="mt-7 max-w-md font-display text-5xl font-black leading-[1.04] tracking-[-.055em] xl:text-6xl">
              Better days start with a run.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-[#0b160f]/75">
              Find your pace, meet your people, and make every Sunday count. Your running community is one step away.
            </p>
            <div className="auth-mascot-wrap mt-9 flex items-center gap-4 rounded-[1.5rem] border border-[#0b160f]/10 bg-white/25 p-4 backdrop-blur-sm" aria-live="polite">
              <div className={`auth-mascot auth-mascot--${mascotMood}`} aria-hidden="true">
                <svg viewBox="0 0 132 120" role="img" className="h-[108px] w-[118px] overflow-visible">
                  <ellipse cx="66" cy="108" rx="42" ry="7" fill="#0b160f" opacity=".12" />
                  <path className="auth-mascot-arm auth-mascot-arm-left" d="M34 68 Q14 75 19 91 Q24 100 34 88" fill="none" stroke="#245b36" strokeWidth="10" strokeLinecap="round" />
                  <path className="auth-mascot-arm auth-mascot-arm-right" d="M98 68 Q118 75 113 91 Q108 100 98 88" fill="none" stroke="#245b36" strokeWidth="10" strokeLinecap="round" />
                  <path className="auth-mascot-body" d="M28 68 Q28 27 66 24 Q104 27 104 68 Q104 99 66 101 Q28 99 28 68Z" fill="#245b36" />
                  <path d="M52 26 Q43 9 55 7 Q67 8 66 24" fill="#245b36" />
                  <path d="M66 24 Q72 6 84 12 Q91 18 79 30" fill="#245b36" />
                  <ellipse cx="51" cy="65" rx="11" ry="14" fill="#fff" />
                  <ellipse cx="81" cy="65" rx="11" ry="14" fill="#fff" />
                  <g className="auth-mascot-eyes">
                    <ellipse cx="53" cy="67" rx="4.5" ry="7" fill="#0b160f" />
                    <ellipse cx="83" cy="67" rx="4.5" ry="7" fill="#0b160f" />
                    <circle cx="54.5" cy="64" r="1.6" fill="#fff" />
                    <circle cx="84.5" cy="64" r="1.6" fill="#fff" />
                  </g>
                  <path className="auth-mascot-mouth" d="M59 83 Q66 90 73 83" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <path d="M38 48 Q46 42 56 46 M76 46 Q87 42 94 48" fill="none" stroke="#0b160f" strokeWidth="3" strokeLinecap="round" />
                  <path d="M47 98 L42 108 M85 98 L90 108" stroke="#0b160f" strokeWidth="7" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0b160f]/50">Your run buddy</p>
                <p className="auth-mascot-caption mt-1 font-display text-lg font-black leading-tight text-[#0b160f]">
                  {mascotMood === "shy" ? "Psst… eyes on your password!" : mascotMood === "curious" ? "Hey! Who’s joining the run?" : mascotMood === "excited" ? "You’ve got this! Almost there." : "Ready when you are!"}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#0b160f]/60">Move your cursor and I’ll follow along.</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-[#0b160f]/15 pt-5 text-xs font-semibold text-[#0b160f]/65">
            <span>Dwarka Sector 19B Park</span>
            <span>Run together. Grow together.</span>
          </div>
        </aside>

        <div className="auth-form-panel min-w-0 p-5 sm:p-9 lg:p-10 xl:p-12">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#a9e66e] font-display text-base font-black text-[#0b160f]">645</span>
            <div>
              <p className="font-display text-sm font-extrabold uppercase tracking-[.15em] text-white">645 Run Club</p>
              <p className="text-xs text-white/45">Run together. Grow together.</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              aria-pressed={!isSignup}
              className={`min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold transition ${!isSignup ? "bg-[#a9e66e] text-[#0b160f] shadow-md" : "text-white/55 hover:text-white"}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => changeMode("signup")}
              aria-pressed={isSignup}
              className={`min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold transition ${isSignup ? "bg-[#a9e66e] text-[#0b160f] shadow-md" : "text-white/55 hover:text-white"}`}
            >
              Create account
            </button>
          </div>

          <div className="auth-heading-motion mb-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a9e66e]">{isSignup ? "Start your journey" : "Good to see you again"}</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isSignup ? "Join the community." : otpSent ? "Check your inbox." : "Welcome back."}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
              {isSignup
                ? "Create your account in a minute. We’ll verify your email before you get started."
                : otpSent
                  ? `We sent a 6-digit sign-in code to ${formData.email}. Enter it below to continue.`
                  : "Choose how you’d like to sign in. It only takes a moment."}
            </p>
          </div>

          {!isSignup && (
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-white/40">Choose sign-in method</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => changeLoginMethod("password")}
                  aria-pressed={loginMethod === "password"}
                  className={`min-h-11 rounded-xl border px-3 py-3 text-sm font-semibold transition ${loginMethod === "password" ? "border-[#a9e66e]/60 bg-[#a9e66e]/10 text-[#d0f2b0]" : "border-white/10 bg-white/[.025] text-white/55 hover:border-white/25 hover:text-white"}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => changeLoginMethod("otp")}
                  aria-pressed={loginMethod === "otp"}
                  className={`min-h-11 rounded-xl border px-3 py-3 text-sm font-semibold transition ${loginMethod === "otp" ? "border-[#a9e66e]/60 bg-[#a9e66e]/10 text-[#d0f2b0]" : "border-white/10 bg-white/[.025] text-white/55 hover:border-white/25 hover:text-white"}`}
                >
                  Email OTP
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-fields-motion space-y-5" noValidate={false}>
            {isSignup && (
              <label className="block">
                <span className={labelClass}>Full name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={80}
                  required
                  className={inputClass}
                />
              </label>
            )}

            {emailInput}

            {(isSignup || loginMethod === "password") && (
              <div className="space-y-3">
                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                />
                {isSignup && (
                  <div className="rounded-xl border border-white/[.07] bg-black/15 p-3.5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-white/65">Password checklist</span>
                      <span className={`text-xs font-bold ${passwordValid ? "text-[#a9e66e]" : "text-white/35"}`}>{passwordRules.filter((rule) => rule.test(formData.password)).length}/4 complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {passwordRules.map((rule) => {
                        const passed = rule.test(formData.password);
                        return (
                          <span key={rule.label} className={`flex items-center gap-2 text-xs ${passed ? "text-[#c8eda8]" : "text-white/40"}`}>
                            <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${passed ? "bg-[#a9e66e] text-[#0b160f]" : "border border-white/20"}`}>{passed ? "✓" : ""}</span>
                            {rule.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isSignup && (
              <PasswordField
                label="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Enter your password again"
                error={Boolean(formData.confirmPassword) && formData.password !== formData.confirmPassword}
              />
            )}

            {!isSignup && loginMethod === "otp" && otpSent && (
              <div className="space-y-3">
                <label className="block">
                  <span className={labelClass}>6-digit verification code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    placeholder="000000"
                    value={loginOtp}
                    onChange={(event) => setLoginOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    className={inputClass + " text-center text-2xl font-bold tracking-[.55em]"}
                  />
                </label>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button type="button" onClick={() => { resetOtp(); setStatus({ type: "", message: "" }); }} className="font-semibold text-white/55 underline underline-offset-4 hover:text-white">
                    Change email
                  </button>
                  <button
                    type="button"
                    disabled={loading || otpCooldown > 0}
                    onClick={async () => {
                      setLoading(true);
                      setStatus({ type: "", message: "" });
                      try {
                        const { data } = await sendLoginOtp(formData.email.trim());
                        setStatus({ type: "success", message: data.message || "A new sign-in code has been sent." });
                        setOtpCooldown(60);
                        setLoginOtp("");
                      } catch (error) {
                        setStatus({ type: "error", message: error.response?.data?.message || "Could not resend the code. Please try again." });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="font-semibold text-[#a9e66e] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : "Resend code"}
                  </button>
                </div>
                <p className="text-xs text-white/35">The code is valid for 10 minutes. Check your spam folder if you can’t find it.</p>
              </div>
            )}

            {status.message && (
              <div
                role={status.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`rounded-xl border px-4 py-3 text-sm leading-5 ${status.type === "success" ? "border-[#a9e66e]/25 bg-[#a9e66e]/[.07] text-[#c8eda8]" : "border-red-400/25 bg-red-400/[.07] text-red-300"}`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignup && Boolean(formData.confirmPassword) && formData.password !== formData.confirmPassword)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a9e66e] px-6 py-3.5 font-display text-sm font-extrabold text-[#0b160f] shadow-[0_8px_28px_rgba(169,230,110,.16)] transition hover:-translate-y-0.5 hover:bg-[#c0f18e] hover:shadow-[0_12px_34px_rgba(169,230,110,.23)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a9e66e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create my account"
                  : loginMethod === "otp"
                    ? otpSent ? "Verify code & sign in" : "Send me a login code"
                    : "Sign in"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-white/30">645 Run Club</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-white/50">
            {isSignup ? "Already have an account?" : "New to the club?"}{" "}
            <button
              type="button"
              onClick={() => changeMode(isSignup ? "login" : "signup")}
              className="font-bold text-[#a9e66e] underline-offset-4 hover:text-white hover:underline"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="mt-6 text-center text-xs leading-5 text-white/30">
            {isSignup ? "Your email address is used to verify and secure your account." : "Secure sign-in. Your password is never shared with other members."}
          </p>
        </div>
      </div>
    </section>
  );
}
