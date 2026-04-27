import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { COMPANY_SIZES, getInitials } from "../utils/constants";

const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Manufacturing",
  "Retail & E-commerce", "Education", "Consulting", "Media & Entertainment",
  "Real Estate", "Logistics", "Energy", "Other",
];

export default function CompanySettings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        const company = data.user?.company;
        if (!company) {
          toast.error("No company profile found.");
          navigate("/employer/dashboard");
          return;
        }
        setCompanyId(company._id);
        setForm({
          name: company.name || "",
          about: company.about || "",
          website: company.website || "",
          location: company.location || "",
          contactEmail: company.contactEmail || "",
          industry: company.industry || "",
          size: company.size || "",
          logo: company.logo || "",
          founded: company.founded || "",
        });
      })
      .catch(() => toast.error("Failed to load company data."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Company name is required."); return; }
    setSaving(true);
    try {
      const { data } = await api.put(`/companies/${companyId}`, form);
      updateUser({ company: data.company });
      toast.success("Company profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes.");
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
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Corporate Profile</h1>
            <p className="text-ink-300 text-lg opacity-80">Maintain your organization's presence on HireVerse.</p>
          </div>
        </div>
      </div>

      <div className="page-container py-12 max-w-4xl flex-1 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Preview Card */}
          <div className="card p-8 border border-gold-500/20 bg-gold-500/5 backdrop-blur-xl shadow-glow-gold/5">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-ink-800 border-4 border-white dark:border-ink-800 flex items-center justify-center text-3xl font-bold text-gold-500 shadow-2xl overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform">
                {form.logo ? (
                  <img src={form.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(form.name || "?")
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-3xl font-bold text-ink-900 dark:text-white tracking-tight">{form.name || "Untitled Organization"}</h3>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-3 text-sm font-medium text-ink-500 dark:text-ink-400">
                  <span className="flex items-center gap-2 px-3 py-1 bg-ink-100 dark:bg-ink-800 rounded-lg">🏷️ {form.industry || "Industry Unset"}</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-ink-100 dark:bg-ink-800 rounded-lg">📍 {form.location || "Remote HQ"}</span>
                  {form.website && <span className="flex items-center gap-2 text-gold-600 dark:text-gold-400">🔗 {new URL(form.website).hostname}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Identity Section */}
          <div className="card p-10 space-y-8 border border-ink-100 dark:border-ink-800 shadow-2xl shadow-ink-900/5 dark:shadow-none">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Organization Identity</h2>
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Corporate Name</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Acme Corporation"
                className="input h-14"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Mission & Vision (About)</label>
              <textarea
                value={form.about}
                onChange={(e) => set("about", e.target.value)}
                placeholder="Describe your corporate culture, mission, and unique value proposition..."
                rows={6}
                className="input p-6 leading-relaxed resize-none"
              />
              <div className="flex justify-end pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-300">{form.about.length} / 2000 characters</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Brand Asset (Logo URL)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">🖼️</span>
                <input
                  value={form.logo}
                  onChange={(e) => set("logo", e.target.value)}
                  placeholder="https://cdn.yourbrand.com/logo.png"
                  className="input h-14 pl-12"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="card p-10 space-y-8 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Operational Details</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Vertical / Industry</label>
                <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className="select h-14">
                  <option value="">Select Domain</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Scale (Employee Count)</label>
                <select value={form.size} onChange={(e) => set("size", e.target.value)} className="select h-14">
                  <option value="">Select Scale</option>
                  {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} Professionals</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Headquarters Location</label>
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="input h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Establishment Year</label>
                <input
                  value={form.founded}
                  onChange={(e) => set("founded", e.target.value)}
                  placeholder="2020"
                  className="input h-14"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Official Website</label>
                <input
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://acme.org"
                  className="input h-14"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Talent Acquisition Email</label>
                <input
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="careers@acme.org"
                  className="input h-14"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-ink-100 dark:border-ink-800">
            <button type="submit" disabled={saving} className="btn-gold py-4 px-12 text-lg font-bold shadow-glow">
              {saving ? (
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Synchronizing...
                </span>
              ) : "🚀 Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              className="font-bold text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
            >
              Cancel Adjustments
            </button>
            {companyId && (
              <a
                href={`/companies/${companyId}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline border-ink-200 dark:border-ink-800 py-3 px-6 text-sm ml-auto flex items-center gap-2 group"
              >
                <span>View Public Display</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
