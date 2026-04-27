import React from "react";
import { JOB_FIELDS, JOB_TYPES, EXPERIENCE_LEVELS, FIELD_ICONS } from "../../utils/constants";

export default function JobFilters({ filters, onChange, onReset, total }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k !== "search" && v && v !== "all" && v !== ""
  );

  return (
    <div className="card p-6 lg:sticky lg:top-24 border-ink-100 dark:border-ink-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-ink-900 dark:text-white text-base">Filters</h3>
        <div className="flex items-center gap-3">
          {total !== undefined && (
            <span className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 font-bold">{total} jobs</span>
          )}
          {hasActiveFilters && (
            <button onClick={onReset} className="text-xs text-coral-500 hover:text-coral-400 font-bold transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Field / Category */}
        <div>
          <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Field / Category</label>
          <div className="space-y-1 mt-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            <button
              onClick={() => set("field", "all")}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.field === "all" || !filters.field ? "bg-gold-500 text-ink-950 shadow-glow" : "hover:bg-ink-50 dark:hover:bg-ink-800/50 text-ink-700 dark:text-ink-300"}`}
            >
              <span className={filters.field === "all" ? "opacity-100" : "opacity-40"}>🔷</span> All Fields
            </button>
            {JOB_FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => set("field", f)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.field === f ? "bg-gold-500 text-ink-950 shadow-glow" : "hover:bg-ink-50 dark:hover:bg-ink-800/50 text-ink-700 dark:text-ink-300"}`}
              >
                <span className={filters.field === f ? "opacity-100" : "opacity-40"}>{FIELD_ICONS[f]}</span> {f}
              </button>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Job Type</label>
          <select
            value={filters.jobType || "all"}
            onChange={(e) => set("jobType", e.target.value)}
            className="select mt-2"
          >
            <option value="all">Any Type</option>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Remote Toggle */}
        <div className="pt-2">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-semibold text-ink-700 dark:text-ink-300 group-hover:text-ink-900 dark:group-hover:text-white transition-colors">Remote Only</span>
            <div
              onClick={() => set("isRemote", filters.isRemote === "true" ? "" : "true")}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${filters.isRemote === "true" ? "bg-jade-500 shadow-glow-jade" : "bg-ink-200 dark:bg-ink-800"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${filters.isRemote === "true" ? "translate-x-6" : "translate-x-1"}`} />
            </div>
          </label>
        </div>

        {/* Location */}
        <div>
          <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Location</label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg grayscale opacity-50">📍</span>
            <input
              type="text"
              value={filters.location || ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City, country or zip..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Experience</label>
          <select
            value={filters.experienceLevel || "all"}
            onChange={(e) => set("experienceLevel", e.target.value)}
            className="select mt-2"
          >
            <option value="all">Any Experience</option>
            {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Min. Salary</label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base opacity-50">💰</span>
            <select
              value={filters.salaryMin || ""}
              onChange={(e) => set("salaryMin", e.target.value)}
              className="select pl-10"
            >
              <option value="">Negotiable</option>
              <option value="30000">$30k+</option>
              <option value="50000">$50k+</option>
              <option value="70000">$70k+</option>
              <option value="100000">$100k+</option>
              <option value="150000">$150k+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
