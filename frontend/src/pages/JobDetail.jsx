import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactForm from "../components/company/ContactForm";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { formatSalary, timeAgo, FIELD_ICONS, FIELD_COLORS, getInitials } from "../utils/constants";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => {
        setJob(data.job);
        if (user?.role === "candidate") {
          api.get("/auth/me").then(({ data: me }) => {
            setApplied(me.user.appliedJobs?.some((a) => (a.job?._id || a.job) === data.job._id));
            setSaved(me.user.savedJobs?.some((j) => (j._id || j) === data.job._id));
          }).catch(() => {});
        }
      })
      .catch(() => toast.error("Job not found."))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    if (!resume) { toast.error("Please upload your resume."); return; }
    
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
      
      await api.post(`/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setApplied(true);
      setShowApplyModal(false);
      toast.success("Application submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed.");
    } finally {
      setApplying(false);
    }
  };

  const handleStartChat = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      const { data } = await api.post("/messages/start", { recipientId: job.postedBy?._id || job.postedBy });
      navigate("/messages", { state: { conversationId: data._id } });
    } catch (error) {
      toast.error("Failed to start conversation.");
    }
  };

  const handleSave = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      const { data } = await api.post(`/jobs/${id}/save`);
      setSaved(data.saved);
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to save job.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-900 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-2">Job not found</h2>
          <Link to="/jobs" className="btn-primary mt-4">Browse Jobs</Link>
        </div>
      </div>
    </div>
  );

  const fieldClass = FIELD_COLORS[job.field] || FIELD_COLORS["Other"];
  const fieldIcon = FIELD_ICONS[job.field] || "🔷";

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      <div className="page-container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header Card */}
            <div className="card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 flex items-center justify-center text-2xl font-bold text-ink-600 dark:text-ink-300 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                  {job.company?.logo ? <img src={job.company.logo} alt="" className="w-full h-full object-cover rounded-2xl" /> : getInitials(job.company?.name || "?")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white leading-tight tracking-tight mb-2">{job.title}</h1>
                      <div className="flex items-center gap-2">
                        <Link to={`/companies/${job.company?._id}`} className="text-gold-600 dark:text-gold-400 hover:underline transition-colors text-base font-bold">
                          {job.company?.name}
                        </Link>
                        {job.company?.isVerified && <span className="text-gold-500 text-lg" title="Verified">✓</span>}
                      </div>
                    </div>
                    <button onClick={handleSave}
                      className={`p-3 rounded-2xl border transition-all ${saved ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow" : "bg-white dark:bg-ink-900/50 border-ink-200 dark:border-ink-800 text-ink-400 hover:text-ink-900 dark:hover:text-white"}`}>
                      <svg className="w-6 h-6" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap gap-2.5 mb-8 relative z-10">
                <span className={`badge border-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest ${fieldClass}`}>{fieldIcon} {job.field}</span>
                <span className="badge-type px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest">{job.jobType}</span>
                {job.isRemote && <span className="badge-remote px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest">🌐 Remote</span>}
                <span className="badge bg-ink-50 dark:bg-ink-800/50 border-2 border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-300 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest">📍 {job.location}</span>
                <span className="badge bg-jade-500/10 border-2 border-jade-500/20 text-jade-600 dark:text-jade-400 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest">⚡ {job.experienceLevel}</span>
              </div>

              {/* Salary + meta stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-ink-50 dark:bg-ink-900/50 rounded-3xl p-6 relative z-10 border border-ink-100 dark:border-ink-800/50">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-400 mb-1">Annual Salary</span>
                  <span className="text-xl font-bold text-ink-900 dark:text-white">{formatSalary(job.salary)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-400 mb-1">Posted On</span>
                  <span className="text-xl font-bold text-ink-900 dark:text-white">{timeAgo(job.createdAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-400 mb-1">Applications</span>
                  <span className="text-xl font-bold text-ink-900 dark:text-white">{job.applicants?.length || 0}</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
                {user?.role === "candidate" && (
                  <button onClick={() => applied ? null : setShowApplyModal(true)} disabled={applied}
                    className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all ${applied ? "bg-jade-500/10 text-jade-600 border-2 border-jade-500/20 cursor-default" : "btn-gold shadow-lg shadow-gold-500/20"}`}>
                    {applied ? "✓ Successfully Applied" : "Submit Your Application"}
                  </button>
                 )}
                {!user && (
                  <Link to="/login" className="flex-1 btn-primary py-4 text-center font-bold text-base shadow-lg shadow-ink-900/10">Sign In to Apply</Link>
                )}
                {applied && (
                  <button onClick={handleStartChat} className="btn-outline border-gold-500/30 text-gold-600 dark:text-gold-400 py-4 px-8 font-bold text-base flex items-center justify-center gap-2">
                    <span className="text-xl">💬</span> Chat with Recruiter
                  </button>
                )}
                <button onClick={() => setShowContactModal(true)} className="btn-outline py-4 px-8 font-bold text-base">
                  📧 Contact Hiring Manager
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="card p-8 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gold-500 rounded-full" />
                  Job Overview
                </h2>
                <div className="text-base text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-wrap">{job.description}</div>
              </div>
              
              {job.requirements && (
                <div className="pt-8 border-t border-ink-100 dark:border-ink-800">
                  <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Key Requirements</h3>
                  <div className="text-base text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
                </div>
              )}
              
              {job.responsibilities && (
                <div className="pt-8 border-t border-ink-100 dark:border-ink-800">
                  <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Role Responsibilities</h3>
                  <div className="text-base text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</div>
                </div>
              )}
              
              {job.skills?.length > 0 && (
                <div className="pt-8 border-t border-ink-100 dark:border-ink-800">
                  <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Target Skills & Proficiency</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span key={s} className="bg-ink-100 dark:bg-ink-800/80 text-ink-700 dark:text-ink-200 px-4 py-2 rounded-xl text-sm font-bold border border-ink-200 dark:border-ink-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Card */}
            {job.company && (
              <div className="card p-8">
                <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-6">Hiring Company</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center font-bold text-xl text-ink-600 dark:text-ink-300 border border-ink-200 dark:border-ink-700 shadow-sm">
                    {getInitials(job.company.name)}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900 dark:text-white text-lg">{job.company.name}</p>
                    {job.company.industry && <p className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider">{job.company.industry}</p>}
                  </div>
                </div>
                {job.company.about && <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-4 mb-6">{job.company.about}</p>}
                <div className="space-y-4 text-sm mb-8">
                  {job.company.location && <p className="flex items-center gap-3 text-ink-600 dark:text-ink-300 font-medium"><span className="text-lg grayscale opacity-50">📍</span>{job.company.location}</p>}
                  {job.company.website && <a href={job.company.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gold-600 hover:text-gold-500 transition-colors font-bold"><span className="text-lg grayscale opacity-50">🌐</span>Official Website</a>}
                  {job.company.contactEmail && <p className="flex items-center gap-3 text-ink-600 dark:text-ink-300 font-medium"><span className="text-lg grayscale opacity-50">📧</span>{job.company.contactEmail}</p>}
                  {job.company.averageRating > 0 && (
                    <div className="flex items-center gap-3 text-ink-600 dark:text-ink-300 font-medium">
                      <span className="text-lg grayscale opacity-50">⭐</span>
                      <span className="font-bold">{job.company.averageRating.toFixed(1)}</span>
                      <span className="opacity-50 text-xs">({job.company.totalReviews} reviews)</span>
                    </div>
                  )}
                </div>
                <Link to={`/companies/${job.company._id}`} className="w-full btn-outline py-3.5 block text-center font-bold">
                  View Detailed Profile
                </Link>
              </div>
            )}

            {/* Share Card */}
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 text-gold-600 flex items-center justify-center text-xl mx-auto mb-4">🔗</div>
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-2">Share Opportunity</h3>
              <p className="text-xs text-ink-400 mb-6">Know someone perfect for this role? Share the link with them.</p>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="w-full btn-primary py-3 px-6 shadow-lg shadow-ink-900/10">
                Copy Link to Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white dark:bg-ink-900 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl animate-fade-up border border-ink-100 dark:border-ink-800" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-2 tracking-tight">Apply for Position</h2>
              <p className="text-ink-500 dark:text-ink-400 font-medium text-lg">{job.title} <span className="opacity-40">@</span> {job.company?.name}</p>
            </div>
            
            <div className="mb-6">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50 mb-3">Professional Statement / Cover Letter</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Highlight your key achievements and why you are the best fit for this specific role..."
                rows={4} className="input resize-none p-5 text-base leading-relaxed" />
            </div>

            <div className="mb-8">
              <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50 mb-3">Upload Resume (PDF, DOC, DOCX)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  onChange={(e) => setResume(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="hidden" 
                  id="resume-upload" 
                />
                <label 
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-ink-800/50 border-2 border-ink-100 dark:border-ink-800 border-dashed rounded-[1.5rem] cursor-pointer hover:border-gold-500/50 hover:bg-gold-500/5 dark:hover:bg-gold-500/5 group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">📄</span>
                    <p className="text-sm font-bold text-ink-600 dark:text-ink-300">
                      {resume ? resume.name : "Select your resume file"}
                    </p>
                    <p className="text-[10px] text-ink-400 mt-1 uppercase tracking-widest">Max file size: 5MB</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleApply} disabled={applying} className="flex-[2] btn-gold py-4 text-lg shadow-glow">
                {applying ? "Sending..." : "Submit Application"}
              </button>
              <button onClick={() => setShowApplyModal(false)} className="flex-1 btn-ghost py-4 font-bold">Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowContactModal(false)}>
          <div className="bg-white dark:bg-ink-900 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl animate-fade-up border border-ink-100 dark:border-ink-800" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-2">Message Employer</h2>
              <p className="text-ink-400">Send a direct message to <span className="text-gold-600 font-bold">{job.company?.name}</span></p>
            </div>
            <ContactForm companyId={job.company?._id} companyName={job.company?.name} onClose={() => setShowContactModal(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
