import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const user = await login(form.email.trim().toLowerCase(), form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 flex flex-col transition-colors duration-500 overflow-hidden relative">
      <Navbar />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 dark:bg-gold-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ink-900/5 dark:bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-ink-900 dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
              <svg className="w-10 h-10 text-gold-400 dark:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-ink-500 dark:text-ink-400 font-medium">Access your HireVerse portal</p>
          </div>

          <div className="card p-10 shadow-2xl shadow-ink-900/10 dark:shadow-none border border-ink-100 dark:border-ink-800 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40 group-focus-within:opacity-100 transition-opacity">📧</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@hireverse.com"
                    className="input pl-12 h-14 text-base"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40 group-focus-within:opacity-100 transition-opacity">🔐</span>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input pl-12 pr-12 h-14 text-base"
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors p-1">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-gold h-14 text-base font-bold shadow-glow mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : "Continue to Dashboard"}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-100 dark:border-ink-800" /></div>
              <div className="relative flex justify-center"><span className="bg-white dark:bg-ink-900 px-4 text-[10px] uppercase tracking-widest font-bold text-ink-400 transition-colors">Security Check</span></div>
            </div>

            <p className="text-center text-sm font-medium text-ink-500 dark:text-ink-400">
              New to the platform?{" "}
              <Link to="/register" className="text-ink-900 dark:text-white font-bold hover:text-gold-600 dark:hover:text-gold-400 transition-colors underline decoration-gold-500/30 underline-offset-4 decoration-2">Create an account</Link>
            </p>
          </div>

          <p className="text-center mt-8 text-[10px] font-bold text-ink-400 uppercase tracking-widest opacity-50">
            Secure Login • 256-bit Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
