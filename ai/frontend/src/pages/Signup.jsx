import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const Signup = () => {
  const { signup } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Create your college account</h2>
      {error && (
        <p className="text-sm text-red-600 mb-3">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">College email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Only approved college domains (e.g. .edu, mycollege.edu) are allowed.
          </p>
        </div>
        <div>
          <label className="block text-xs mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

