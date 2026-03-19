import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [toast, setToast] = useState(null);
  const [timer, setTimer] = useState(30);
  const [blockedUntil, setBlockedUntil] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  useEffect(() => {
    let interval;
    if (blockedUntil) {
      interval = setInterval(() => {
        if (Date.now() > blockedUntil) {
          setBlockedUntil(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [blockedUntil]);

  const sendOTP = async () => {
    if (!contact) return showToast("error", "Enter email or phone");

    showToast("info", "Sending OTP...");

    await fetch("http://localhost:5000/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });

    setOtpSent(true);
    setTimer(30);
    showToast("success", "OTP Sent ✅");
  };

  const verifyOTP = async () => {
    if (blockedUntil && Date.now() < blockedUntil) {
      return showToast("error", "You are blocked. Try later ⛔");
    }

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return showToast("error", "Enter valid OTP");

    const res = await fetch("http://localhost:5000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, otp: finalOtp }),
    });

    if (res.status === 403) {
      const blockTime = Date.now() + 10 * 60 * 1000;
      setBlockedUntil(blockTime);
      return showToast("error", "Blocked for 10 minutes ⛔");
    }

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      showToast("success", "Login Successful 🎉");
      setTimeout(() => (window.location.href = "/welcome"), 1500);
    } else {
      showToast("error", data.error || "Invalid OTP");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const getBlockRemaining = () => {
    if (!blockedUntil) return 0;
    const diff = Math.max(0, Math.floor((blockedUntil - Date.now()) / 1000));
    return diff;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow text-white text-sm ${toast.type === "success"
          ? "bg-green-500"
          : toast.type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
          }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">

        <div className="text-center mb-6">
         <div className="w-40 h-20 mx-auto flex items-center justify-center bg-white shadow-lg border border-blue-200 rounded-md">
  <img
    src="/logo.jpg"
    alt="Cyseck Logo"
    className="max-w-full max-h-full object-contain"
  />
</div>
          <h2 className="text-lg font-semibold mt-3 text-gray-700">
            OTP-Based Authentication
          </h2>
          <p className="text-xs text-gray-500">Cyseck Company</p>
        </div>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Email or Phone"
            className="w-full pl-12 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <button
          onClick={sendOTP}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-4"
        >
          Send OTP
        </button>

        {otpSent && (
          <div>
            <div className="flex justify-between mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 text-center border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              disabled={blockedUntil && Date.now() < blockedUntil}
              className={`w-full py-2 rounded-lg transition ${blockedUntil && Date.now() < blockedUntil
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {blockedUntil && Date.now() < blockedUntil
                ? `Blocked (${getBlockRemaining()}s)`
                : "Verify OTP"}
            </button>

            <div className="text-center text-xs text-gray-500 mt-3">
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button onClick={sendOTP} className="text-blue-500 hover:underline">
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-5">
          Secure OTP Login System
        </p>
      </div>
    </div>
  );
}
