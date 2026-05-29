const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const router = require("express").Router();
const { authMiddleware } = require("../../utils/auth");
const Project = require("../../models/Project");

// ===============================
// CREATE PROJECT
// POST /api/projects
// ===============================
router.post("/", authMiddleware , async (req, res) => {
  try {
    console.log(req.user);
    const project = await Project.create({
      ...req.body,
      user: req.user._id, // Logged-in user ID   // _id: '6a17266a66a8d391e679f110',
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// GET ALL PROJECTS OF LOGGED USER
// GET /api/projects
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user._id,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ===============================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// UPDATE PROJECT
// PUT /api/projects/:id
// ===============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// DELETE PROJECT
// DELETE /api/projects/:id
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;