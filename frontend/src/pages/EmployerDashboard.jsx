import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { timeAgo, getInitials, FIELD_ICONS } from "../utils/constants";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get("/jobs/employer/my")
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => toast.error("Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (job) => {
    try {
      await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      setJobs((prev) =>
        prev.map((j) => j._id === job._id ? { ...j, isActive: !j.isActive } : j)
      );
      toast.success(job.isActive ? "Job deactivated." : "Job activated.");
    } catch {
      toast.error("Failed to update job.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this job posting?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalApplicants = jobs.reduce((s, j) => s + (j.applicants?.length || 0), 0);
  const totalViews = jobs.reduce((s, j) => s + (j.views || 0), 0);
  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      {/* Header */}
      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="page-container relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-3xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-bold text-2xl shadow-glow-gold/20">
                {getInitials(user?.name || "")}
              </div>
              <div>
                <p className="text-gold-400/80 text-xs font-bold uppercase tracking-widest mb-1">Employer Portal</p>
                <h1 className="font-display text-4xl font-bold tracking-tight">
                  Welcome, {user?.name?.split(" ")[0]} 🏢
                </h1>
                <p className="text-ink-300 text-base mt-2 opacity-80">
                  Manage your listings, track applications, and find your next hire.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/employer/company-settings" className="btn-outline border-white/10 text-white hover:bg-white/5 py-3 px-6 backdrop-blur-xl">
                ⚙️ Settings
              </Link>
              <Link to="/employer/post-job" className="btn-gold py-3 px-8 text-base">
                + Post New Job
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
          {[
            { icon: "📋", label: "Total Jobs", val: jobs.length, color: "bg-blue-500/10 text-blue-600" },
            { icon: "✅", label: "Active Jobs", val: activeJobs, color: "bg-jade-500/10 text-jade-600" },
            { icon: "👥", label: "Applicants", val: totalApplicants, color: "bg-gold-500/10 text-gold-600" },
            { icon: "👁️", label: "Total Views", val: totalViews, color: "bg-ink-900/10 dark:bg-white/10 text-ink-600 dark:text-ink-400" },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="card p-6 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-xl mb-3 shadow-sm`}>
                {icon}
              </div>
              <p className="text-3xl font-bold text-ink-900 dark:text-white">{val}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-ink-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Jobs list header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Your Job Listings</h2>
            <p className="text-ink-500 dark:text-ink-400 mt-1">Manage and monitor all your current job postings</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-ink-900/30 p-1 rounded-xl border border-ink-100 dark:border-ink-800">
            <span className="px-4 py-2 text-xs font-bold text-ink-400 uppercase tracking-widest">Sort: Latest</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-3xl" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-24 border-dashed border-2">
            <p className="text-6xl mb-6 grayscale opacity-30">📋</p>
            <h3 className="font-semibold text-ink-900 dark:text-white text-2xl mb-3">No jobs posted yet</h3>
            <p className="text-ink-500 dark:text-ink-400 mb-8 max-w-sm mx-auto">
              Ready to find your next great hire? Post your first job listing and reach thousands of qualified candidates.
            </p>
            <Link to="/employer/post-job" className="btn-gold px-12 py-3">
              Post Your First Job Listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <div
                key={job._id}
                className="card p-6 group animate-fade-up border-l-4 border-l-transparent hover:border-l-gold-500"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {FIELD_ICONS[job.field] || "💼"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-bold text-ink-900 dark:text-white text-xl hover:text-gold-600 transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`badge border-2 px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            job.isActive
                              ? "bg-jade-500/10 text-jade-600 border-jade-500/20"
                              : "bg-ink-500/10 text-ink-500 border-ink-500/20"
                          }`}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-ink-500 dark:text-ink-400">
                        <span className="flex items-center gap-1.5">🏷️ {job.field}</span>
                        <span className="opacity-30">•</span>
                        <span className="flex items-center gap-1.5">📍 {job.location}</span>
                        <span className="opacity-30">•</span>
                        <span className="font-bold text-ink-900 dark:text-ink-300">👥 {job.applicants?.length || 0} Applicants</span>
                        <span className="opacity-30">•</span>
                        <span className="flex items-center gap-1.5 opacity-60 italic">Posted {timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-6 lg:pt-0 border-t lg:border-none border-ink-50 dark:border-ink-800">
                    <Link
                      to={`/employer/jobs/${job._id}/applicants`}
                      className={`btn-primary text-xs py-2.5 px-5 font-bold uppercase tracking-wider ${
                        (job.applicants?.length || 0) === 0 ? "opacity-30 pointer-events-none" : "shadow-lg shadow-ink-900/10 dark:shadow-none"
                      }`}
                    >
                      View Applicants
                    </Link>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(job)}
                        className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white border border-ink-100 dark:border-ink-700 transition-colors"
                        title={job.isActive ? "Deactivate Job" : "Activate Job"}
                      >
                        {job.isActive ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      <Link
                        to={`/employer/jobs/${job._id}/edit`}
                        className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white border border-ink-100 dark:border-ink-700 transition-colors"
                        title="Edit Job"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deletingId === job._id}
                        className="p-2.5 rounded-xl bg-coral-500/10 text-coral-500 hover:bg-coral-500 hover:text-white transition-all border border-coral-500/20 disabled:opacity-30"
                        title="Delete Job"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
