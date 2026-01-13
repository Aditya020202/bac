import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuthContext();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
      <p className="text-xs text-gray-500 mb-4">
        We sent a 6-digit code to <span className="font-medium">{email}</span>.
      </p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Verification code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm tracking-[0.3em] text-center bg-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;

