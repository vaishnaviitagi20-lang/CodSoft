import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JobCard from "../components/jobs/JobCard";
import api from "../utils/api";
import { JOB_FIELDS, FIELD_ICONS, FIELD_COLORS } from "../utils/constants";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [recentJobs, setRecentJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs?limit=6").then(({ data }) => {
      setRecentJobs(data.jobs);
      setStats((prev) => ({ ...prev, jobs: data.total }));
    }).finally(() => setLoading(false));
    api.get("/companies").then(({ data }) => {
      setStats((prev) => ({ ...prev, companies: data.companies?.length || 0 }));
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      {/* Hero */}
      <section className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-64 h-64 bg-gold-400 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="page-container py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-jade-400 rounded-full animate-pulse" />
              <span className="font-medium">{stats.jobs > 0 ? `${stats.jobs.toLocaleString()} live job listings` : "Thousands of live listings"}</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight mb-6 animate-fade-up tracking-tight" style={{ animationDelay: "0.1s" }}>
              Find Work That <span className="text-gold-400 drop-shadow-glow">Matters</span>
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
              Connecting ambitious professionals with companies building the future.
              The smarter way to find your next career move.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto animate-fade-up bg-white/10 p-2 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl" style={{ animationDelay: "0.3s" }}>
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, skill, or company..."
                  className="w-full bg-transparent text-white placeholder-blue-200/60 pl-11 pr-4 py-4 rounded-2xl text-base focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-gold px-8 py-4 rounded-2xl text-base shadow-lg hover:scale-105 transition-transform">
                Search Jobs
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {["IT", "Finance", "Healthcare", "Marketing", "Core Engineering"].map((f) => (
                <Link key={f} to={`/jobs?field=${encodeURIComponent(f)}`}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full px-4 py-2 text-sm transition-all backdrop-blur-md hover:-translate-y-0.5">
                  <span className="opacity-80">{FIELD_ICONS[f]}</span> {f}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="page-container py-6">
            <div className="flex flex-wrap justify-center gap-12 text-center">
              {[
                { label: "Live Jobs", val: stats.jobs || "1,000+" },
                { label: "Companies", val: stats.companies || "500+" },
                { label: "Job Fields", val: "12+" },
                { label: "Candidates", val: "10k+" },
              ].map(({ label, val }) => (
                <div key={label} className="group cursor-default">
                  <p className="text-3xl font-bold text-white group-hover:text-gold-400 transition-colors">{val}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-blue-200/50 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Field */}
      <section className="py-20 bg-white dark:bg-ink-950 transition-colors">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title text-4xl mb-3">Browse by Field</h2>
            <p className="text-ink-500 dark:text-ink-400 max-w-lg mx-auto">Explore thousands of opportunities across 12 diverse professional sectors</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {JOB_FIELDS.slice(0, 12).map((f) => (
              <Link key={f} to={`/jobs?field=${encodeURIComponent(f)}`}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all group hover:scale-105 ${FIELD_COLORS[f] || "bg-ink-50 dark:bg-ink-900/50 border-ink-100 dark:border-ink-800"}`}>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ink-800 flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform">
                  {FIELD_ICONS[f]}
                </div>
                <span className="text-sm font-bold text-center leading-tight">{f}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-24 bg-ink-50 dark:bg-ink-900/30 transition-colors relative">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="section-title text-4xl mb-2">Latest Opportunities</h2>
              <p className="text-ink-500 dark:text-ink-400">Freshly posted listings updated in real-time</p>
            </div>
            <Link to="/jobs" className="btn-outline group">
              View All <span className="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-5">
              {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid gap-5">
              {recentJobs.map((job, i) => (
                <div key={job._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/jobs" className="btn-primary px-10 py-4 shadow-xl shadow-ink-900/10 dark:shadow-none">
              Explore All Job Listings
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for employers */}
      <section className="py-24 bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-400/5 blur-[120px] pointer-events-none" />
        <div className="page-container text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Hiring? Find Your Next <span className="text-gold-400">Industry Star</span>
          </h2>
          <p className="text-xl text-ink-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Post your listings today and get access to our massive pool of high-quality candidates across all professional sectors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=employer" className="btn-gold px-10 py-4 text-lg">Post a Job for Free</Link>
            <Link to="/jobs" className="btn-outline border-white/10 text-white hover:bg-white/5 px-10 py-4 text-lg backdrop-blur-xl">Browse Talent Pool</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
