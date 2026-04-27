import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: params.get("role") || "candidate",
    companyName: "", companyLocation: "", companyWebsite: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required."); return; }
    if (!form.email.trim()) { toast.error("Email is required."); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match."); return; }
    if (form.role === "employer" && !form.companyName.trim()) { toast.error("Company name is required."); return; }
    setLoading(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        companyName: form.companyName,
        companyLocation: form.companyLocation,
        companyWebsite: form.companyWebsite,
      });
      toast.success(`Welcome to HireVerse, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
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
        <div className="w-full max-w-[560px]">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-white mb-2 tracking-tight">Join the Future of Hiring</h1>
            <p className="text-ink-500 dark:text-ink-400 font-medium">Create your HireVerse account to get started</p>
          </div>

          <div className="card p-10 shadow-2xl shadow-ink-900/10 dark:shadow-none border border-ink-100 dark:border-ink-800 backdrop-blur-xl">
            {/* Role selector */}
            <div className="mb-10">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50 text-center block mb-4">I want to join as a...</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "candidate", label: "Talent", icon: "👤", desc: "I'm looking for a job" },
                  { value: "employer", label: "Employer", icon: "🏢", desc: "I'm looking to hire" },
                ].map((r) => (
                  <button key={r.value} type="button" onClick={() => set("role", r.value)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all duration-300 ${form.role === r.value ? "border-gold-500 bg-gold-500/5 shadow-glow-gold/10" : "border-ink-100 dark:border-ink-800 hover:border-ink-200 dark:hover:border-ink-700 bg-white/50 dark:bg-ink-900/50"}`}>
                    <span className="text-3xl mb-1">{r.icon}</span>
                    <span className={`font-bold text-base transition-colors ${form.role === r.value ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>{r.label}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Full Name</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" className="input h-13" required />
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" className="input h-13" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Password</label>
                  <div className="relative group">
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 6 chars" className="input h-13 pr-12" required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Repeat password" className="input h-13" required />
                </div>
              </div>

              {form.role === "employer" && (
                <div className="space-y-6 pt-8 border-t border-ink-100 dark:border-ink-800 animate-fade-down">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                    <h3 className="font-bold text-ink-900 dark:text-white text-base">Company Information</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Legal Entity Name</label>
                    <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Acme Corporation" className="input h-13" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Headquarters</label>
                      <input value={form.companyLocation} onChange={(e) => set("companyLocation", e.target.value)} placeholder="New York, USA" className="input h-13" />
                    </div>
                    <div className="space-y-2">
                      <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Corporate Website</label>
                      <input value={form.companyWebsite} onChange={(e) => set("companyWebsite", e.target.value)} placeholder="https://acme.com" className="input h-13" />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full btn-gold h-14 text-base font-bold shadow-glow mt-4">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Identity...
                  </span>
                ) : "Create HireVerse Account"}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-100 dark:border-ink-800" /></div>
              <div className="relative flex justify-center"><span className="bg-white dark:bg-ink-900 px-4 text-[10px] uppercase tracking-widest font-bold text-ink-400 transition-colors">Privacy Guaranteed</span></div>
            </div>

            <p className="text-center text-sm font-medium text-ink-500 dark:text-ink-400">
              Already a member?{" "}
              <Link to="/login" className="text-ink-900 dark:text-white font-bold hover:text-gold-600 dark:hover:text-gold-400 transition-colors underline decoration-gold-500/30 underline-offset-4 decoration-2">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
