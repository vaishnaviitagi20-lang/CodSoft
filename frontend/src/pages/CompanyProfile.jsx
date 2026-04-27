import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JobCard from "../components/jobs/JobCard";
import ReviewSection from "../components/reviews/ReviewSection";
import ContactForm from "../components/company/ContactForm";
import api from "../utils/api";
import { getInitials } from "../utils/constants";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [tab, setTab] = useState("jobs");

  useEffect(() => {
    api
      .get(`/companies/${id}`)
      .then(({ data }) => {
        setCompany(data.company);
        setJobs(data.jobs || []);
      })
      .catch(() => toast.error("Company not found."))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div className="animate-fade-up">
            <p className="text-8xl mb-8 grayscale opacity-20">🏢</p>
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-4">Organization Not Found</h2>
            <p className="text-ink-500 dark:text-ink-400 mb-8 max-w-md mx-auto">The company profile you're looking for might have been removed or the URL is incorrect.</p>
            <Link to="/jobs" className="btn-gold py-3 px-8">Return to Opportunities</Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ["jobs", "reviews", "about"];

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500 overflow-hidden relative">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-ink-900 text-white pt-24 pb-16 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <div className="page-container relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Logo */}
            <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-ink-800 border-8 border-white/5 dark:border-ink-800/50 flex items-center justify-center text-4xl font-bold text-gold-500 flex-shrink-0 overflow-hidden shadow-2xl shadow-black/20 transform hover:rotate-3 transition-transform">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(company.name)
              )}
            </div>

            <div className="flex-1 text-center md:text-left min-w-0 pt-4">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                <h1 className="font-display text-5xl font-bold tracking-tight">{company.name}</h1>
                {company.isVerified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Identity Verified
                  </span>
                )}
              </div>
              
              <p className="text-xl text-ink-300 font-medium max-w-2xl mx-auto md:mx-0 opacity-80 leading-relaxed">
                {company.industry || "Global Enterprise"} 
                {company.size && <span className="mx-2 opacity-30">|</span>}
                {company.size && `${company.size} Professionals`}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 mt-8 text-sm font-bold uppercase tracking-widest text-ink-400">
                {company.location && <span className="flex items-center gap-2">📍 {company.location}</span>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
                    🌐 Corporate Hub ↗
                  </a>
                )}
                {company.averageRating > 0 && (
                  <span className="flex items-center gap-2 text-white">
                    ⭐ {company.averageRating.toFixed(1)} <span className="opacity-40">({company.totalReviews} Endorsements)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 min-w-[200px]">
              <button
                onClick={() => setShowContact(true)}
                className="w-full btn-gold py-4 px-8 text-base font-bold shadow-glow"
              >
                Connect with Hiring
              </button>
              <div className="flex justify-between items-center px-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Openings</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{company.totalReviews || 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="page-container py-16 flex-1 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Elegant Tabs */}
            <div className="flex gap-8 mb-12 border-b border-ink-100 dark:border-ink-800">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${
                    tab === t
                      ? "text-ink-900 dark:text-white"
                      : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
                  }`}
                >
                  {t === "jobs" ? `Positions (${jobs.length})` : t === "reviews" ? `Endorsements (${company.totalReviews || 0})` : "Identity"}
                  {tab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-500 rounded-full animate-fade-in" />}
                </button>
              ))}
            </div>

            <div className="animate-fade-up">
              {tab === "jobs" && (
                <div className="space-y-6">
                  {jobs.length === 0 ? (
                    <div className="card text-center py-24 border-dashed border-2">
                      <p className="text-6xl mb-6 grayscale opacity-20">💼</p>
                      <h3 className="text-2xl font-bold text-ink-900 dark:text-white mb-2">No active openings</h3>
                      <p className="text-ink-500 dark:text-ink-400 max-w-sm mx-auto font-medium">This organization isn't currently hiring for any positions. Subscribe to updates to be the first to know.</p>
                    </div>
                  ) : (
                    jobs.map((job) => <JobCard key={job._id} job={job} />)
                  )}
                </div>
              )}

              {tab === "reviews" && <ReviewSection companyId={id} />}

              {tab === "about" && (
                <div className="card p-10 border border-ink-100 dark:border-ink-800 shadow-2xl shadow-ink-900/5 dark:shadow-none">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                    <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Organization Mission</h2>
                  </div>
                  {company.about ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg text-ink-700 dark:text-ink-300 leading-relaxed whitespace-pre-wrap font-medium">
                        {company.about}
                      </p>
                    </div>
                  ) : (
                    <p className="text-ink-400 text-lg italic opacity-60">This organization has not yet detailed their mission statement.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-8">
            <div className="card p-8 border border-ink-100 dark:border-ink-800 bg-white/50 dark:bg-ink-900/30 backdrop-blur-xl">
              <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-8 tracking-tight">Organization DNA</h3>
              <div className="space-y-6">
                {[
                  { icon: "🏢", label: "Industry Sector", val: company.industry },
                  { icon: "👥", label: "Professional Scale", val: company.size ? `${company.size} Specialists` : null },
                  { icon: "📍", label: "Global HQ", val: company.location },
                  { icon: "📅", label: "Establishment", val: company.founded },
                  { icon: "📧", label: "Direct Inquiries", val: company.contactEmail },
                ].map(({ icon, label, val }) =>
                  val ? (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-800 transition-colors hover:border-gold-500/20">
                      <span className="text-2xl grayscale opacity-40">{icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-ink-900 dark:text-white font-bold truncate">{val}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-ink-100 dark:border-ink-800">
                <p className="text-center text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Share this Profile</p>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 flex items-center justify-center cursor-pointer hover:bg-gold-500 hover:text-white transition-all">
                      {i === 1 ? '🔗' : i === 2 ? '🐦' : '💼'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Message */}
            <div className="card p-8 bg-gold-500 text-ink-950 shadow-glow border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <h4 className="text-xl font-bold mb-2">Hiring Manager?</h4>
              <p className="text-sm font-bold opacity-80 mb-6 leading-relaxed">Join the world's leading organizations on the HireVerse platform today.</p>
              <Link to="/register?role=employer" className="inline-block bg-ink-950 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest shadow-xl transform active:scale-95 transition-transform">Get Started Free</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modern Contact Modal */}
      {showContact && (
        <div
          className="fixed inset-0 bg-ink-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowContact(false)}
        >
          <div
            className="bg-white dark:bg-ink-900 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl animate-fade-up border border-ink-100 dark:border-ink-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white tracking-tight">
                  Inquiry Portal
                </h2>
                <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mt-1">Direct message to {company.name}</p>
              </div>
              <button
                onClick={() => setShowContact(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 transition-colors"
              >
                ✕
              </button>
            </div>
            <ContactForm
              companyId={id}
              companyName={company.name}
              onClose={() => setShowContact(false)}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
