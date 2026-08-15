import { useState, useEffect } from "react";
import { sendVerificationOtp, verifyEmailOtp } from "../api/api.js";
import { saveAuthSession } from "../utils/auth.js";

export default function EmailVerificationModal({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState("");
  const [status, setStatus] = useState({
    type: "success",
    message: "We sent a verification code to your email.",
  });
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading("verify");
    setStatus({ type: "", message: "" });

    try {
      const { data } = await verifyEmailOtp({ email, otp });

      saveAuthSession({ token: data.token, user: data.user });

      setStatus({
        type: "success",
        message: data.message || "Email verified successfully",
      });
      onVerified?.(data.user);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Invalid verification code",
      });
    } finally {
      setLoading("");
    }
  };

  const handleResend = async () => {
    setLoading("resend");
    setStatus({ type: "", message: "" });

    try {
      const { data } = await sendVerificationOtp(email);
      setStatus({
        type: "success",
        message: data.message || "Verification code sent again",
      });
      setResendTimer(30); // Start 30-second timer
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not resend code",
      });
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="card w-full max-w-md border-primary/40 bg-[#181818] shadow-[0_0_30px_rgba(15,157,88,0.2)]">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-offwhite/70 mb-5">
          Enter the 6 digit code sent to {email}.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            autoComplete="one-time-code"
            placeholder="Verification code"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            required
            className="w-full bg-[#111111] border-2 border-primary/50 rounded-xl px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] text-white placeholder:text-base placeholder:tracking-normal placeholder:text-offwhite/35 focus:outline-none focus:border-primary shadow-inner shadow-black/20"
          />

          <button type="submit" disabled={loading === "verify"} className="btn-primary w-full">
            {loading === "verify" ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading === "resend" || resendTimer > 0}
          className="btn-outline w-full mt-3"
        >
          {loading === "resend"
            ? "Sending..."
            : resendTimer > 0
            ? `Resend Code (${resendTimer}s)`
            : "Resend Code"}
        </button>

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
    </div>
  );
}
