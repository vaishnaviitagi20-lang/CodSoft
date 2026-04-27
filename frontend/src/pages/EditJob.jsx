import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { JOB_FIELDS, JOB_TYPES, EXPERIENCE_LEVELS } from "../utils/constants";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => {
        const job = data.job;
        setForm({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements || "",
          responsibilities: job.responsibilities || "",
          location: job.location || "",
          isRemote: job.isRemote || false,
          jobType: job.jobType || "Full-time",
          field: job.field || "IT",
          experienceLevel: job.experienceLevel || "Mid",
          salaryMin: job.salary?.min || "",
          salaryMax: job.salary?.max || "",
          salaryDisplay: job.salary?.display || "",
          skills: (job.skills || []).join(", "),
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          isActive: job.isActive !== false,
        });
      })
      .catch(() => {
        toast.error("Job not found.");
        navigate("/employer/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.description.trim()) { toast.error("Description is required."); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      await api.put(`/jobs/${id}`, payload);
      toast.success("Job updated successfully!");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500 overflow-hidden relative">
      <Navbar />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 dark:bg-gold-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ink-900/5 dark:bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="page-container max-w-4xl relative z-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Modify Posting</h1>
            <p className="text-ink-300 text-lg opacity-80">Updating details for <span className="text-white font-bold">{form.title}</span></p>
          </div>
        </div>
      </div>

      <div className="page-container py-12 max-w-4xl flex-1 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card p-10 space-y-8 animate-fade-up border border-ink-100 dark:border-ink-800 shadow-2xl shadow-ink-900/5 dark:shadow-none">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Core Information</h2>
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Job Designation</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className="input h-14" required />
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
                <input value={form.location} onChange={(e) => set("location", e.target.value)} className="input h-14" required />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Seniority</label>
                <select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} className="select h-14">
                  {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <label className="flex items-center gap-4 p-4 rounded-2xl bg-ink-50 dark:bg-ink-900/50 border border-ink-100 dark:border-ink-800 cursor-pointer group transition-all hover:border-gold-500/30">
                <div onClick={(e) => { e.preventDefault(); set("isRemote", !form.isRemote); }} className={`w-10 h-6 rounded-full relative transition-all duration-300 ${form.isRemote ? 'bg-jade-500' : 'bg-ink-200 dark:bg-ink-800'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.isRemote ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Remote Accessible</span>
              </label>
              <label className="flex items-center gap-4 p-4 rounded-2xl bg-ink-50 dark:bg-ink-900/50 border border-ink-100 dark:border-ink-800 cursor-pointer group transition-all hover:border-gold-500/30">
                <div onClick={(e) => { e.preventDefault(); set("isActive", !form.isActive); }} className={`w-10 h-6 rounded-full relative transition-all duration-300 ${form.isActive ? 'bg-jade-500' : 'bg-ink-200 dark:bg-ink-800'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-bold text-ink-700 dark:text-ink-300">Currently Active</span>
              </label>
            </div>
          </div>

          {/* Compensation */}
          <div className="card p-10 space-y-8 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Compensation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Floor Salary ($)</label>
                <input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="60000" className="input h-14" />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Ceiling Salary ($)</label>
                <input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="80000" className="input h-14" />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Public Label</label>
                <input value={form.salaryDisplay} onChange={(e) => set("salaryDisplay", e.target.value)} placeholder="$60k–$80k/yr" className="input h-14" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card p-10 space-y-8 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Content & Scope</h2>
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Mission Statement / Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={8} className="input p-6 leading-relaxed resize-none" required />
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Requirements</label>
                <textarea value={form.requirements} onChange={(e) => set("requirements", e.target.value)} rows={5} className="input p-4 text-sm leading-relaxed resize-none" />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Responsibilities</label>
                <textarea value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} rows={5} className="input p-4 text-sm leading-relaxed resize-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Required Skillsets</label>
              <input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, Node.js, MongoDB" className="input h-14" />
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Application Closing Date</label>
              <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className="input h-14" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-6 border-t border-ink-100 dark:border-ink-800">
            <button type="submit" disabled={saving} className="btn-gold py-4 px-12 text-lg font-bold shadow-glow">
              {saving ? "Commiting Changes..." : "🚀 Save Adjustments"}
            </button>
            <button type="button" onClick={() => navigate("/employer/dashboard")} className="font-bold text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
              Discard Changes
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
