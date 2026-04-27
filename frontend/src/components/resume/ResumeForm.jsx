import React from "react";

export default function ResumeForm({ data, setData }) {
  const handleChange = (section, index, field, value) => {
    if (index === null) {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      const newList = [...data[section]];
      newList[index][field] = value;
      setData((prev) => ({ ...prev, [section]: newList }));
    }
  };

  const addItem = (section, emptyObj) => {
    setData((prev) => ({ ...prev, [section]: [...prev[section], emptyObj] }));
  };

  const removeItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-10">
      {/* Personal Info */}
      <section className="bg-white dark:bg-ink-900/50 p-8 rounded-[2.5rem] border border-ink-100 dark:border-ink-800 shadow-sm">
        <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Full Name</label>
            <input
              type="text"
              value={data.personalInfo.name}
              onChange={(e) => handleChange("personalInfo", null, "name", e.target.value)}
              className="input py-3.5"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Email Address</label>
            <input
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => handleChange("personalInfo", null, "email", e.target.value)}
              className="input py-3.5"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Phone Number</label>
            <input
              type="text"
              value={data.personalInfo.phone}
              onChange={(e) => handleChange("personalInfo", null, "phone", e.target.value)}
              className="input py-3.5"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">LinkedIn Profile</label>
            <input
              type="text"
              value={data.personalInfo.linkedin}
              onChange={(e) => handleChange("personalInfo", null, "linkedin", e.target.value)}
              className="input py-3.5"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="label uppercase text-[10px] tracking-widest font-bold opacity-50">Professional Summary</label>
            <textarea
              value={data.personalInfo.summary}
              onChange={(e) => handleChange("personalInfo", null, "summary", e.target.value)}
              className="input py-3.5 resize-none"
              rows={4}
              placeholder="Brief overview of your career and goals..."
            />
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-white dark:bg-ink-900/50 p-8 rounded-[2.5rem] border border-ink-100 dark:border-ink-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ink-900 dark:text-white flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
            Education
          </h3>
          <button
            onClick={() => addItem("education", { degree: "", institution: "", year: "", grade: "" })}
            className="text-xs font-bold text-gold-600 hover:text-gold-500 flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">+</span> Add Education
          </button>
        </div>
        <div className="space-y-6">
          {data.education.map((edu, idx) => (
            <div key={idx} className="p-6 bg-ink-50 dark:bg-ink-800/50 rounded-3xl border border-ink-100 dark:border-ink-800 relative group">
              <button
                onClick={() => removeItem("education", idx)}
                className="absolute top-4 right-4 text-ink-300 hover:text-coral-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Degree / Major"
                  value={edu.degree}
                  onChange={(e) => handleChange("education", idx, "degree", e.target.value)}
                  className="input text-sm py-3"
                />
                <input
                  type="text"
                  placeholder="School / University"
                  value={edu.institution}
                  onChange={(e) => handleChange("education", idx, "institution", e.target.value)}
                  className="input text-sm py-3"
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2018 - 2022)"
                  value={edu.year}
                  onChange={(e) => handleChange("education", idx, "year", e.target.value)}
                  className="input text-sm py-3"
                />
                <input
                  type="text"
                  placeholder="GPA / Grade"
                  value={edu.grade}
                  onChange={(e) => handleChange("education", idx, "grade", e.target.value)}
                  className="input text-sm py-3"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white dark:bg-ink-900/50 p-8 rounded-[2.5rem] border border-ink-100 dark:border-ink-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ink-900 dark:text-white flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
            Experience
          </h3>
          <button
            onClick={() => addItem("experience", { company: "", role: "", duration: "", description: "" })}
            className="text-xs font-bold text-gold-600 hover:text-gold-500 flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">+</span> Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="p-6 bg-ink-50 dark:bg-ink-800/50 rounded-3xl border border-ink-100 dark:border-ink-800 relative group">
              <button
                onClick={() => removeItem("experience", idx)}
                className="absolute top-4 right-4 text-ink-300 hover:text-coral-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleChange("experience", idx, "company", e.target.value)}
                  className="input text-sm py-3"
                />
                <input
                  type="text"
                  placeholder="Role / Title"
                  value={exp.role}
                  onChange={(e) => handleChange("experience", idx, "role", e.target.value)}
                  className="input text-sm py-3"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. Jan 2020 - Present)"
                  value={exp.duration}
                  onChange={(e) => handleChange("experience", idx, "duration", e.target.value)}
                  className="input text-sm py-3 md:col-span-2"
                />
                <textarea
                  placeholder="Description of responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => handleChange("experience", idx, "description", e.target.value)}
                  className="input text-sm py-3 md:col-span-2 resize-none"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white dark:bg-ink-900/50 p-8 rounded-[2.5rem] border border-ink-100 dark:border-ink-800 shadow-sm">
        <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
          Skills
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="React, Node.js, Python, Leadership (comma separated)"
            value={data.skills.join(", ")}
            onChange={(e) => setData(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))}
            className="input py-3.5"
          />
          <p className="text-[10px] text-ink-400 font-bold uppercase tracking-widest pl-1">Separate skills with commas</p>
        </div>
      </section>
    </div>
  );
}
