import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500 overflow-hidden relative">
      <Navbar />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-jade-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="text-center max-w-2xl">
          <div className="relative inline-block mb-8">
            <p className="font-display text-[180px] sm:text-[240px] font-bold text-ink-900/5 dark:text-white/5 leading-none select-none tracking-tighter">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl sm:text-8xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 cursor-default">🧭</span>
            </div>
          </div>
          
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-900 dark:text-white mb-6 tracking-tight">
              Lost in the HireVerse?
            </h1>
            <p className="text-lg sm:text-xl text-ink-500 dark:text-ink-400 mb-12 leading-relaxed max-w-lg mx-auto font-medium opacity-80">
              The coordinate you're seeking doesn't exist or has been shifted across the talent dimension. Let's get you back on track.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto btn-outline border-ink-200 dark:border-ink-800 py-4 px-10 text-sm font-bold uppercase tracking-widest"
              >
                ← Return to Safety
              </button>
              <Link to="/" className="w-full sm:w-auto btn-gold py-4 px-10 text-sm font-bold uppercase tracking-widest shadow-glow">
                Go to Portal
              </Link>
            </div>

            <div className="mt-16 pt-12 border-t border-ink-100 dark:border-ink-800">
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[0.3em] mb-6">Explore the Network</p>
              <div className="flex flex-wrap gap-8 justify-center">
                <Link to="/jobs" className="text-sm text-ink-900 dark:text-white font-bold hover:text-gold-500 transition-all flex items-center gap-2 group">
                  <span>Explore Jobs</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/register" className="text-sm text-ink-900 dark:text-white font-bold hover:text-gold-500 transition-all flex items-center gap-2 group">
                  <span>Join as Talent</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
