export const JOB_FIELDS = [
  "IT", "Core Engineering", "Finance", "Marketing",
  "Healthcare", "Education", "Sales", "Design",
  "HR", "Legal", "Operations", "Other",
];

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

export const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead", "Executive"];

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export const FIELD_ICONS = {
  IT: "💻", "Core Engineering": "⚙️", Finance: "💹", Marketing: "📣",
  Healthcare: "🏥", Education: "🎓", Sales: "🤝", Design: "🎨",
  HR: "👥", Legal: "⚖️", Operations: "📦", Other: "🔷",
};

export const FIELD_COLORS = {
  IT: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
  "Core Engineering": "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20",
  Finance: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
  Marketing: "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-100 dark:border-pink-500/20",
  Healthcare: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20",
  Education: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
  Sales: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20",
  Design: "bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-500/20",
  HR: "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-500/20",
  Legal: "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-100 dark:border-slate-500/20",
  Operations: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
  Other: "bg-ink-50 dark:bg-ink-800/50 text-ink-700 dark:text-ink-300 border-ink-100 dark:border-ink-700",
};

export const formatSalary = (salary) => {
  if (!salary) return "Competitive";
  if (salary.display) return salary.display;
  if (salary.min && salary.max)
    return `$${(salary.min / 1000).toFixed(0)}k – $${(salary.max / 1000).toFixed(0)}k/yr`;
  if (salary.min) return `From $${(salary.min / 1000).toFixed(0)}k/yr`;
  return "Competitive";
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
};

export const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
