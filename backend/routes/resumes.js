const express = require("express");
const Resume = require("../models/Resume");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/resumes/my
router.get("/my", protect, async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      // Return empty structure if not found
      return res.json({
        success: true,
        resume: {
          personalInfo: { name: req.user.name, email: req.user.email },
          education: [],
          experience: [],
          projects: [],
          skills: [],
        },
      });
    }
    res.json({ success: true, resume });
  } catch (err) {
    next(err);
  }
});

// POST /api/resumes
router.post("/", protect, async (req, res, next) => {
  try {
    const { personalInfo, education, experience, projects, skills, template } = req.body;

    let resume = await Resume.findOne({ userId: req.user._id });

    if (resume) {
      // Update
      resume.personalInfo = personalInfo;
      resume.education = education;
      resume.experience = experience;
      resume.projects = projects;
      resume.skills = skills;
      resume.template = template;
      await resume.save();
    } else {
      // Create
      resume = await Resume.create({
        userId: req.user._id,
        personalInfo,
        education,
        experience,
        projects,
        skills,
        template,
      });
    }

    res.json({ success: true, resume, message: "Resume saved successfully!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
