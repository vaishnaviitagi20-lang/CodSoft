import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                <img src={logo} alt="HireVerse Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-xl font-semibold text-white">HireVerse</span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              Connecting top talent with world-class companies. Find your next opportunity or hire exceptional candidates.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-gold-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register?role=candidate" className="hover:text-gold-400 transition-colors">Create Account</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-gold-400 transition-colors">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register?role=employer" className="hover:text-gold-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-gold-400 transition-colors">Employer Dashboard</Link></li>
              <li><Link to="/employer/company-settings" className="hover:text-gold-400 transition-colors">Company Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} HireVerse. All rights reserved.</p>
          <p className="text-xs text-ink-600">Built with MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
