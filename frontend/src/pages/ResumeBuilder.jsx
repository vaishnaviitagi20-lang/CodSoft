import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ResumeForm from "../components/resume/ResumeForm";
import ResumePreview from "../components/resume/ResumePreview";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const INITIAL_DATA = {
  personalInfo: { name: "", email: "", phone: "", linkedin: "", github: "", summary: "" },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  template: "modern"
};

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef();

  useEffect(() => {
    if (user) {
      api.get("/resumes/my")
        .then(({ data: res }) => {
          if (res.resume) {
            setData({
              ...INITIAL_DATA,
              ...res.resume,
              personalInfo: { ...INITIAL_DATA.personalInfo, ...res.resume.personalInfo }
            });
          }
        })
        .catch(() => toast.error("Failed to load your resume."))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/resumes", data);
      toast.success("Resume saved successfully!");
    } catch (err) {
      toast.error("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const element = document.getElementById("resume-content");
    const opt = {
      margin: 0,
      filename: `${data.personalInfo.name || "My"}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().from(element).set(opt).save();
    toast.success("Downloading PDF...");
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      <div className="bg-ink-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="page-container relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Resume Architect</h1>
            <p className="text-ink-300">Design your career narrative with precision and style.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-outline border-white/20 text-white px-8 py-3.5 hover:bg-white/10">
              {saving ? "Saving..." : "Save Progress"}
            </button>
            <button onClick={handleDownload} className="btn-gold shadow-glow px-8 py-3.5">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-12 flex-1">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Side */}
          <div className="animate-fade-right">
            <ResumeForm data={data} setData={setData} />
          </div>

          {/* Preview Side */}
          <div className="hidden lg:block animate-fade-left">
            <ResumePreview data={data} ref={previewRef} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
