import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { JOB_FIELDS, JOB_TYPES, EXPERIENCE_LEVELS } from "../utils/constants";

const EMPTY_FORM = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  location: "",
  isRemote: false,
  jobType: "Full-time",
  field: "IT",
  experienceLevel: "Mid",
  salaryMin: "",
  salaryMax: "",
  salaryDisplay: "",
  skills: "",
  deadline: "",
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Job title is required."); return; }
    if (!form.description.trim()) { toast.error("Description is required."); return; }
    if (!form.location.trim()) { toast.error("Location is required."); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await api.post("/jobs", payload);
      toast.success("Job posted successfully! 🎉");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "input";
  const labelCls = "label";

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500 overflow-hidden relative">
      <Navbar />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 dark:bg-gold-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ink-900/5 dark:bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="page-container max-w-4xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Publish a Position</h1>
              <p className="text-ink-300 text-lg opacity-80">Connect with exceptional talent across the HireVerse network.</p>
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10">
              {[
                { n: 1, label: "Identity" },
                { n: 2, label: "Reward" },
                { n: 3, label: "Mission" },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-3 px-3 py-1.5 rounded-full transition-all">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      step >= n ? "bg-gold-500 text-ink-950 shadow-glow" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {n}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest hidden sm:inline ${step >= n ? "text-white" : "text-white/40"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12 max-w-4xl flex-1 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card p-10 space-y-8 animate-fade-up border border-ink-100 dark:border-ink-800 shadow-2xl shadow-ink-900/5 dark:shadow-none">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Professional Context</h2>
              </div>

              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Job Designation / Title</label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Lead Full-Stack Engineer"
                  className="input h-14 text-base"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Operational Domain</label>
                  <select value={form.field} onChange={(e) => set("field", e.target.value)} className="select h-14">
                    {JOB_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Employment Framework</label>
                  <select value={form.jobType} onChange={(e) => set("jobType", e.target.value)} className="select h-14">
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Primary Location</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40">📍</span>
                    <input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="input h-14 pl-12"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Required Seniority</label>
                  <select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} className="select h-14">
                    {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-center justify-between p-6 rounded-[1.5rem] bg-ink-50 dark:bg-ink-900/50 border border-ink-100 dark:border-ink-800 cursor-pointer group transition-all hover:border-gold-500/30">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${form.isRemote ? "bg-jade-500 text-white shadow-glow-jade" : "bg-ink-100 dark:bg-ink-800 text-ink-400 grayscale"}`}>
                      🌐
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 dark:text-white">Distributed / Remote Friendly</p>
                      <p className="text-xs text-ink-400 font-medium mt-1">This position allows for work from any location.</p>
                    </div>
                  </div>
                  <div
                    onClick={(e) => { e.preventDefault(); set("isRemote", !form.isRemote); }}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.isRemote ? "bg-jade-500" : "bg-ink-200 dark:bg-ink-800"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${form.isRemote ? "translate-x-7" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => setStep(2)} className="btn-primary py-4 px-12 font-bold text-base shadow-lg shadow-ink-900/10">
                  Next: Compensation Detail
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Compensation */}
          {step === 2 && (
            <div className="card p-10 space-y-8 animate-fade-up border border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Compensation Structure</h2>
              </div>
              <p className="text-sm font-medium text-ink-500 dark:text-ink-400 bg-gold-500/5 border border-gold-500/10 p-4 rounded-xl">
                💡 <span className="font-bold text-gold-600 dark:text-gold-400">Market Insight:</span> Positions with transparent salary ranges receive significantly higher engagement from qualified applicants.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Minimum Threshold ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink-400">$</span>
                    <input
                      type="number"
                      value={form.salaryMin}
                      onChange={(e) => set("salaryMin", e.target.value)}
                      placeholder="60000"
                      className="input h-14 pl-8"
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Maximum Threshold ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink-400">$</span>
                    <input
                      type="number"
                      value={form.salaryMax}
                      onChange={(e) => set("salaryMax", e.target.value)}
                      placeholder="95000"
                      className="input h-14 pl-8"
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Formatted Label</label>
                  <input
                    value={form.salaryDisplay}
                    onChange={(e) => set("salaryDisplay", e.target.value)}
                    placeholder="e.g. $60k - $95k / year"
                    className="input h-14"
                  />
                  <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mt-2 px-1">Visible to candidates</p>
                </div>
              </div>

              {form.salaryMin && form.salaryMax && (
                <div className="bg-jade-500/5 border-2 border-jade-500/10 rounded-[1.5rem] p-6 text-center animate-pulse-slow">
                  <p className="text-jade-600 dark:text-jade-400 font-bold text-lg">
                    Current Range: ${Number(form.salaryMin).toLocaleString()} – ${Number(form.salaryMax).toLocaleString()} USD
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button type="button" onClick={() => setStep(1)} className="font-bold text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                  ← Previous Stage
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary py-4 px-12 font-bold text-base shadow-lg shadow-ink-900/10">
                  Next: Mission & Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="card p-10 space-y-8 animate-fade-up border border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">The Mission</h2>
              </div>

              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Detailed Role Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Define the scope of impact, the daily challenges, and the cultural environment..."
                  rows={8}
                  className="input p-6 text-base leading-relaxed resize-none"
                  required
                />
                <div className="flex justify-end pt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${form.description.length > 500 ? 'text-jade-500' : 'text-ink-300'}`}>
                    {form.description.length} characters
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Hard & Soft Requirements</label>
                  <textarea
                    value={form.requirements}
                    onChange={(e) => set("requirements", e.target.value)}
                    placeholder="List the essential skills and background..."
                    rows={5}
                    className="input p-4 text-sm leading-relaxed resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Core Responsibilities</label>
                  <textarea
                    value={form.responsibilities}
                    onChange={(e) => set("responsibilities", e.target.value)}
                    placeholder="What will the candidate own and execute?..."
                    rows={5}
                    className="input p-4 text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Target Skill Stack</label>
                <input
                  value={form.skills}
                  onChange={(e) => set("skills", e.target.value)}
                  placeholder="e.g. React, Docker, Strategic Leadership, Python"
                  className="input h-14"
                />
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mt-2 px-1 opacity-50 italic">Separate skills with commas</p>
              </div>

              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Application Closing Date</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  className="input h-14"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-ink-100 dark:border-ink-800">
                <button type="button" onClick={() => setStep(2)} className="font-bold text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                  ← Review Compensation
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold py-4 px-12 text-lg font-bold shadow-glow"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Broadcasting...
                    </span>
                  ) : "🚀 Publish to HireVerse"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
}
