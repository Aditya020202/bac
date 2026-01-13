import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">Forgot password</h2>
      <p className="text-xs text-gray-500 mb-4">
        Enter your registered college email and we will send you a reset code.
      </p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {sent && (
        <p className="text-xs text-emerald-600 mb-3">
          Reset code sent. Check your inbox.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset code"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

