import React, { forwardRef } from "react";

const ResumePreview = forwardRef(({ data }, ref) => {
  return (
    <div className="sticky top-24">
      <div 
        ref={ref}
        id="resume-content"
        className="bg-white text-slate-800 p-10 shadow-2xl min-h-[1100px] w-full max-w-[800px] mx-auto overflow-hidden font-serif"
      >
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-slate-900 mb-2">
            {data.personalInfo.name || "YOUR NAME"}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.linkedin && <span>• LinkedIn: {data.personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-slate-700 italic">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-4">Professional Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{exp.role || "Role"}</h3>
                    <span className="text-xs font-bold text-slate-500 uppercase">{exp.duration || "Dates"}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 mb-2">{exp.company || "Company"}</p>
                  <p className="text-sm text-slate-700 leading-snug whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{edu.degree || "Degree"}</h3>
                    <p className="text-sm text-slate-600">{edu.institution || "Institution"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">{edu.year || "Year"}</span>
                    {edu.grade && <span className="text-xs text-slate-400 italic">GPA: {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && data.skills[0] !== "" && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-3">Core Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="text-sm text-slate-700 bg-slate-50 px-3 py-1 rounded border border-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

export default ResumePreview;
