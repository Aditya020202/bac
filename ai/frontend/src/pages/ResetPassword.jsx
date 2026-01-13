import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword: password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">Reset password</h2>
      <p className="text-xs text-gray-500 mb-4">
        Enter the code we sent to <span className="font-medium">{email}</span> and your
        new password.
      </p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Reset code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

