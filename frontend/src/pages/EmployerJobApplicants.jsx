import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { getInitials } from "../utils/constants";

export default function EmployerJobApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get(`/jobs/${id}/applicants`)
      .then(({ data }) => {
        setApplicants(data.applicants);
        setJobTitle(data.jobTitle);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load applicants.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (userId, status) => {
    setUpdatingId(userId);
    try {
      await api.put(`/jobs/${id}/applicants/${userId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a.user._id === userId ? { ...a, status } : a))
      );
      
      const messages = {
        accepted: "Application accepted.",
        rejected: "Application rejected.",
        interview: "Candidate called for interview!",
        pending: "Reset to pending."
      };
      toast.success(messages[status] || "Status updated.");

      // If interview, send an automated message
      if (status === "interview") {
        try {
          await api.post("/messages", {
            recipientId: userId,
            content: `Hello! We've reviewed your application for "${jobTitle}" and would like to schedule an interview with you. Please let us know your availability.`,
          });
        } catch (msgErr) {
          console.error("Failed to send automated interview message");
        }
      }
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
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

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="page-container relative z-10">
          <Link to="/employer/dashboard" className="text-gold-400 text-xs font-bold uppercase tracking-widest hover:text-gold-300 transition-colors flex items-center gap-2 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Return to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl font-bold tracking-tight mb-2">Talent Pool</h1>
              <p className="text-ink-300 text-lg opacity-80 max-w-2xl">
                Evaluating {applicants.length} candidates for <span className="text-white font-bold">{jobTitle || "Job Listing"}</span>
              </p>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-1">Total Pool</p>
                  <p className="text-2xl font-bold">{applicants.length}</p>
               </div>
               <div className="px-4 py-2 bg-jade-500/10 border border-jade-500/20 rounded-2xl backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-widest text-jade-400 font-bold mb-1">Interviewing</p>
                  <p className="text-2xl font-bold text-jade-400">{applicants.filter(a => a.status === 'interview').length}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12 flex-1">
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-48 rounded-[2.5rem]" />
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="card text-center py-24 border-dashed border-2">
            <p className="text-8xl mb-8 grayscale opacity-20">👥</p>
            <h3 className="font-semibold text-ink-900 dark:text-white text-3xl mb-4 tracking-tight">No Applicants Yet</h3>
            <p className="text-ink-500 dark:text-ink-400 max-w-md mx-auto text-lg leading-relaxed">
              Your recruitment cycle has begun! As soon as candidates submit their profiles, you'll find them here ready for evaluation.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {applicants.map((app, i) => (
              <div key={app.user._id} className="card p-10 flex flex-col lg:flex-row gap-10 animate-fade-up border border-ink-100 dark:border-ink-800 transition-all hover:shadow-2xl hover:shadow-ink-900/5 dark:hover:shadow-none" style={{ animationDelay: `${i * 0.05}s` }}>
                {/* Candidate Info */}
                <div className="flex items-start gap-8 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-3xl bg-ink-100 dark:bg-ink-800 border-2 border-ink-200 dark:border-ink-700 flex items-center justify-center text-3xl font-bold text-ink-600 dark:text-ink-300 shadow-sm flex-shrink-0">
                    {getInitials(app.user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{app.user.name}</h3>
                      <span className={`text-[10px] uppercase font-bold px-4 py-1.5 rounded-full border-2 tracking-widest ${
                        app.status === 'accepted' ? 'bg-jade-500/10 text-jade-600 border-jade-500/20' :
                        app.status === 'interview' ? 'bg-gold-500/10 text-gold-600 border-gold-500/20' :
                        app.status === 'rejected' ? 'bg-coral-500/10 text-coral-600 border-coral-500/20' :
                        'bg-ink-500/10 text-ink-500 border-ink-500/20'
                      }`}>
                        {app.status === 'accepted' ? 'Accepted' : app.status === 'interview' ? 'Interviewing' : app.status === 'rejected' ? 'Rejected' : 'Under Review'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8">
                      <p className="text-sm font-bold text-ink-500 dark:text-ink-400 flex items-center gap-2">
                        <span className="text-lg opacity-40">📧</span> {app.user.email}
                      </p>
                      <p className="text-sm font-bold text-ink-400 flex items-center gap-2">
                        <span className="text-lg opacity-40">📅</span> Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    
                    {app.coverLetter && (
                      <div className="bg-ink-50 dark:bg-ink-900/50 p-8 rounded-[2rem] border border-ink-100 dark:border-ink-800 relative group transition-all hover:bg-white dark:hover:bg-ink-900 shadow-inner">
                        <div className="absolute -top-3 left-8 px-4 py-1.5 bg-white dark:bg-ink-800 border-2 border-ink-100 dark:border-ink-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ink-400 shadow-sm">Candidate Pitch</div>
                        <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed font-medium">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {app.resume && (
                      <div className="mt-4">
                        <a 
                          href={`http://localhost:5001${app.resume}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-ink-800 border-2 border-ink-100 dark:border-ink-700 rounded-2xl text-xs font-bold uppercase tracking-widest text-ink-600 dark:text-ink-300 hover:border-gold-500/50 hover:text-gold-600 transition-all shadow-sm group"
                        >
                          <span className="text-xl grayscale group-hover:grayscale-0 transition-all">📄</span>
                          Review Full Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-row lg:flex-col gap-4 justify-center min-w-[220px] pt-8 lg:pt-0 border-t lg:border-none border-ink-50 dark:border-ink-800">
                  {app.status === 'pending' || app.status === 'interview' ? (
                    <>
                      {app.status !== 'interview' && (
                        <button
                          onClick={() => handleUpdateStatus(app.user._id, "interview")}
                          disabled={updatingId === app.user._id}
                          className="flex-1 btn-gold py-4 px-6 text-[10px] font-bold uppercase tracking-widest shadow-glow shadow-gold-500/20 disabled:opacity-30 flex items-center justify-center gap-2"
                        >
                          {updatingId === app.user._id ? "..." : (
                            <>
                              <span className="text-lg">📞</span>
                              Call for Interview
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleStartChat(app.user._id)}
                        className="flex-1 btn-outline py-4 px-6 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">💬</span>
                        Message Candidate
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.user._id, "accepted")}
                        disabled={updatingId === app.user._id}
                        className="flex-1 bg-jade-500 text-white rounded-2xl py-4 px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-jade-600 transition-colors shadow-lg shadow-jade-500/20 disabled:opacity-30"
                      >
                        {updatingId === app.user._id ? "..." : "Confirm Selection"}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.user._id, "rejected")}
                        disabled={updatingId === app.user._id}
                        className="flex-1 btn-outline border-coral-500/20 text-coral-600 dark:text-coral-400 hover:bg-coral-500 hover:text-white py-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-30"
                      >
                        {updatingId === app.user._id ? "..." : "Decline Candidate"}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-700 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-1">Outcome</p>
                        <p className={`text-sm font-bold ${app.status === 'accepted' ? 'text-jade-500' : 'text-coral-500'}`}>
                          {app.status === 'accepted' ? 'Candidate Hired' : 'Application Closed'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(app.user._id, "pending")}
                        disabled={updatingId === app.user._id}
                        className="text-[10px] font-bold text-ink-400 hover:text-ink-900 dark:hover:text-white uppercase tracking-[0.2em] py-2 px-4 transition-colors"
                      >
                        Re-evaluate Candidate
                      </button>
                    </div>
                  )}
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
