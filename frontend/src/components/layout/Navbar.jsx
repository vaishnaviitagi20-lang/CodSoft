import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/constants";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md border-b border-ink-100 dark:border-ink-800 shadow-sm dark:shadow-ink-900/50 transition-colors duration-300">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-ink-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-gold-500/20 transition-all duration-300 overflow-hidden">
              <img src={logo} alt="HireVerse Logo" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white transition-colors">
              Hire<span className="text-gold-500">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/jobs" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive("/jobs") ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800"}`}>
              Browse Jobs
            </Link>
            {!user && (
              <Link to="/register?role=employer" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname.includes("register") ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800"}`}>
                Post a Job
              </Link>
            )}
            {user?.role === "employer" && (
              <>
                <Link to="/employer/dashboard" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive("/employer/dashboard") ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800"}`}>
                  Dashboard
                </Link>
                <Link to="/employer/post-job" className="btn-gold text-sm px-4 py-2 ml-1">
                  + Post Job
                </Link>
              </>
            )}
            {user?.role === "candidate" && (
              <Link to="/candidate/dashboard" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive("/candidate/dashboard") ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800"}`}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            ) : (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-ink-900 dark:text-white leading-none">{user.name}</p>
                    <p className="text-xs text-ink-400 dark:text-ink-500 capitalize mt-0.5">{user.role}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-ink-900 dark:bg-ink-800 flex items-center justify-center text-gold-400 font-bold text-sm shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <svg className={`w-4 h-4 text-ink-400 transition-transform ${dropOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-ink-100 dark:border-ink-800 py-2 animate-fade-in transition-colors overflow-hidden">
                    <div className="px-4 py-2 border-b border-ink-50 dark:border-ink-800 mb-1">
                      <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-ink-400 dark:text-ink-500 truncate">{user.email}</p>
                    </div>
                    {user.role === "employer" && (
                      <>
                        <Link to="/employer/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <span>📊</span> Dashboard
                        </Link>
                        <Link to="/employer/post-job" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <span>➕</span> Post Job
                        </Link>
                        <Link to="/employer/company-settings" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <span>🏢</span> Company Settings
                        </Link>
                      </>
                    )}
                    {user.role === "candidate" && (
                      <>
                        <Link to="/candidate/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <span>👤</span> My Dashboard
                        </Link>
                        <Link to="/resume-builder" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                          <span>📄</span> Resume Architect
                        </Link>
                      </>
                    )}

                    <Link to="/messages" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                      <span>💬</span> Messages
                    </Link>
                    <div className="border-t border-ink-50 dark:border-ink-800 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10 transition-colors">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-ink-50 text-ink-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-ink-100 py-3 space-y-1 animate-fade-in">
            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Browse Jobs</Link>
            {!user && <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-ink-900 hover:bg-ink-50 rounded-xl">Get Started</Link>
            </>}
            {user && <>
              {user.role === "employer" && <>
                <Link to="/employer/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Dashboard</Link>
                <Link to="/employer/post-job" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Post Job</Link>
              </>}
              {user.role === "candidate" && <Link to="/candidate/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Dashboard</Link>}
              <Link to="/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 rounded-xl">Messages</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-coral-500 hover:bg-coral-50 rounded-xl">Sign Out</button>
            </>}
          </div>
        )}
      </div>
    </nav>
  );
}
