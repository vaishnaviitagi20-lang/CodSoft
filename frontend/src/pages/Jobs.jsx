import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_FILTERS = { search: "", field: "all", jobType: "all", isRemote: "", location: "", experienceLevel: "all", salaryMin: "" };

export default function Jobs() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") || "",
    field: searchParams.get("field") || "all",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load saved/applied from user
  useEffect(() => {
    if (user?.role === "candidate") {
      api.get("/auth/me").then(({ data }) => {
        setSavedJobs((data.user.savedJobs || []).map((j) => (typeof j === "object" ? j._id : j)));
        setAppliedJobs((data.user.appliedJobs || []).map((a) => (a.job?._id || a.job)));
      }).catch(() => {});
    }
  }, [user]);

  const fetchJobs = useCallback(async (f, p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (f.search) params.set("search", f.search);
      if (f.field && f.field !== "all") params.set("field", f.field);
      if (f.jobType && f.jobType !== "all") params.set("jobType", f.jobType);
      if (f.isRemote) params.set("isRemote", f.isRemote);
      if (f.location) params.set("location", f.location);
      if (f.experienceLevel && f.experienceLevel !== "all") params.set("experienceLevel", f.experienceLevel);
      if (f.salaryMin) params.set("salaryMin", f.salaryMin);

      const { data } = await api.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce on search input, immediate on other filters
  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(filters, 1), filters.search ? 400 : 0);
    setPage(1);
    return () => clearTimeout(timer);
  }, [filters, fetchJobs]);

  const handleSave = async (jobId) => {
    if (!user) { toast.error("Please log in to save jobs."); return; }
    try {
      const { data } = await api.post(`/jobs/${jobId}/save`);
      setSavedJobs((prev) => data.saved ? [...prev, jobId] : prev.filter((id) => id !== jobId));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job.");
    }
  };

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleReset = () => setFilters(DEFAULT_FILTERS);

  const activeFieldLabel = filters.field !== "all" ? filters.field : null;

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      {/* Header */}
      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[100px]" />
        </div>
        <div className="page-container relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold mb-3 tracking-tight">
              {activeFieldLabel ? `${activeFieldLabel} Jobs` : "Discover Your Next Career Move"}
            </h1>
            <p className="text-ink-300 text-lg mb-8">
              {total > 0 ? `${total.toLocaleString()} position${total !== 1 ? "s" : ""} currently available` : "Finding the best matches for you..."}
            </p>
            {/* Search bar in header */}
            <div className="relative group max-w-xl">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 group-focus-within:text-gold-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search by job title, skill, or company..."
                className="w-full bg-white/10 border border-white/10 text-white placeholder-ink-400/70 pl-11 pr-4 py-4 rounded-2xl text-base focus:outline-none focus:border-gold-400/50 focus:bg-white/15 transition-all backdrop-blur-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12 flex-1">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between bg-white dark:bg-ink-900/50 p-4 rounded-2xl border border-ink-100 dark:border-ink-800 shadow-sm">
          <p className="text-sm font-medium text-ink-600 dark:text-ink-400">{total} matches found</p>
          <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="btn-gold text-xs py-2 px-4">
            🔧 Filter Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className={`w-full lg:w-80 flex-shrink-0 ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24">
              <JobFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} total={total} />
            </div>
          </aside>

          {/* Job list */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid gap-5">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="skeleton h-40 rounded-3xl" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card dark:bg-ink-900/40 p-20 text-center animate-fade-in border-dashed border-2">
                <p className="text-6xl mb-6 grayscale opacity-50">🔍</p>
                <h3 className="font-semibold text-ink-900 dark:text-white text-2xl mb-3">No matching jobs found</h3>
                <p className="text-ink-500 dark:text-ink-400 mb-8 max-w-sm mx-auto">We couldn't find any jobs matching your current filters. Try broadening your search.</p>
                <button onClick={handleReset} className="btn-primary px-8">Reset All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid gap-5">
                  {jobs.map((job, i) => (
                    <div key={job._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <JobCard
                        job={job}
                        saved={savedJobs.includes(job._id)}
                        onSave={user?.role === "candidate" ? handleSave : undefined}
                        applied={appliedJobs.includes(job._id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-ink-100 dark:border-ink-800">
                    <button 
                      onClick={() => { setPage(p => p - 1); fetchJobs(filters, page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      disabled={page === 1} 
                      className="btn-outline py-2.5 px-5 text-sm"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1.5">
                      {[...Array(pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setPage(i + 1); fetchJobs(filters, i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                            page === i + 1 
                              ? "bg-gold-500 text-ink-950 shadow-glow" 
                              : "bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => { setPage(p => p + 1); fetchJobs(filters, page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      disabled={page === pages} 
                      className="btn-outline py-2.5 px-5 text-sm"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
