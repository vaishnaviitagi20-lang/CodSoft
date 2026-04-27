import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JobCard from "../components/jobs/JobCard";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { timeAgo, getInitials } from "../utils/constants";

const STATUS_STYLES = {
  pending: "bg-gold-500/10 text-gold-600 dark:text-gold-400 border-gold-500/20",
  reviewed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  accepted: "bg-jade-500/10 text-jade-600 dark:text-jade-400 border-jade-500/20",
  rejected: "bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-500/20",
  interview: "bg-gold-500 text-white border-gold-600 shadow-lg shadow-gold-500/20",
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("applied");

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setMe(data.user))
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/save`);
      setMe((prev) => ({
        ...prev,
        savedJobs: prev.savedJobs.filter(
          (j) => (j._id || j) !== jobId
        ),
      }));
      toast.success("Removed from saved jobs.");
    } catch {
      toast.error("Failed to unsave.");
    }
  };

  const handleStartChat = async (recipientId) => {
    try {
      const { data } = await api.post("/messages/start", { recipientId });
      navigate("/messages", { state: { conversationId: data._id } });
    } catch (error) {
      toast.error("Failed to start conversation.");
    }
  };

  const appliedJobs = me?.appliedJobs || [];
  const savedJobs = me?.savedJobs || [];

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      {/* Header */}
      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="page-container relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-bold text-2xl shadow-glow-gold/20">
              {getInitials(user?.name || "")}
            </div>
            <div>
              <p className="text-gold-400/80 text-xs font-bold uppercase tracking-widest mb-1">Candidate Portal</p>
              <h1 className="font-display text-4xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-ink-300 text-base mt-2 opacity-80">
                You have <span className="text-white font-bold">{appliedJobs.length}</span> active applications and <span className="text-white font-bold">{savedJobs.length}</span> saved opportunities.
              </p>
            </div>
            <div className="flex-1 flex justify-center sm:justify-end">
              <Link to="/resume-builder" className="btn-gold shadow-glow px-8 py-3.5 flex items-center gap-2 group">
                <span className="text-xl group-hover:rotate-12 transition-transform">📄</span>
                Resume Architect
              </Link>
            </div>
          </div>
        </div>

      </div>

      <div className="page-container py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
          {[
            { icon: "📨", label: "Applications", val: appliedJobs.length, color: "bg-blue-500/10 text-blue-600" },
            { icon: "🔖", label: "Saved Jobs", val: savedJobs.length, color: "bg-gold-500/10 text-gold-600" },
            { icon: "✅", label: "Accepted", val: appliedJobs.filter((a) => a.status === "accepted").length, color: "bg-jade-500/10 text-jade-600" },
            { icon: "👁️", label: "Reviewed", val: appliedJobs.filter((a) => a.status === "reviewed").length, color: "bg-ink-900/10 dark:bg-white/10 text-ink-600 dark:text-ink-400" },
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-ink-900/30 p-1.5 rounded-2xl border border-ink-100 dark:border-ink-800 w-fit">
          {[
            { key: "applied", label: `My Applications` },
            { key: "saved", label: `Saved Jobs` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === key
                  ? "bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-950 shadow-lg"
                  : "text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-3xl" />
            ))}
          </div>
        ) : tab === "applied" ? (
          appliedJobs.length === 0 ? (
            <div className="card text-center py-24 border-dashed border-2">
              <p className="text-6xl mb-6 grayscale opacity-30">📨</p>
              <h3 className="font-semibold text-ink-900 dark:text-white text-2xl mb-3">No applications yet</h3>
              <p className="text-ink-500 dark:text-ink-400 mb-8 max-w-sm mx-auto">
                Your future career is waiting! Start exploring and applying to jobs that match your skills.
              </p>
              <Link to="/jobs" className="btn-gold px-10 py-3">Browse Latest Jobs</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {appliedJobs.map((app, i) => {
                if (!app.job) return null;
                const job = app.job;
                return (
                  <div
                    key={job._id || i}
                    className="card p-6 flex flex-col sm:flex-row sm:items-center gap-5 group animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex items-center justify-center font-bold text-ink-600 dark:text-ink-300 flex-shrink-0 text-lg shadow-sm">
                      {getInitials(job.company?.name || "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="font-bold text-ink-900 dark:text-white text-lg hover:text-gold-600 transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 flex items-center gap-2">
                        <span className="font-medium">{job.company?.name}</span>
                        <span className="opacity-30">•</span>
                        <span className="text-xs">Applied {timeAgo(app.appliedAt)}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-ink-50 dark:border-ink-800">
                      <span
                        className={`badge border-2 px-4 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-widest ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}
                      >
                        {app.status}
                      </span>
                      <button
                        onClick={() => handleStartChat(job.postedBy?._id || job.postedBy)}
                        title="Chat with Employer"
                        className="p-2.5 rounded-xl bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 hover:scale-110 transition-all shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <Link to={`/jobs/${job._id}`} className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          savedJobs.length === 0 ? (
            <div className="card text-center py-24 border-dashed border-2">
              <p className="text-6xl mb-6 grayscale opacity-30">🔖</p>
              <h3 className="font-semibold text-ink-900 dark:text-white text-2xl mb-3">No saved jobs</h3>
              <p className="text-ink-500 dark:text-ink-400 mb-8 max-w-sm mx-auto">
                Found something interesting? Save it here so you can revisit and apply whenever you're ready.
              </p>
              <Link to="/jobs" className="btn-primary px-10 py-3">Explore Jobs</Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {savedJobs.map((job, i) => {
                if (!job || !job._id) return null;
                return (
                  <div key={job._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <JobCard
                      job={job}
                      saved={true}
                      onSave={handleUnsave}
                    />
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
