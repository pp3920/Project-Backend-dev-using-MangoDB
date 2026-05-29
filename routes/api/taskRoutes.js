    const router = require("express").Router();
    const { authMiddleware } = require("../../utils/auth");
    const Task = require("../../models/Task");
    const Project = require("../../models/Project");

    // =========================================================================
    // 1. CREATE TASK
    // POST /api/projects/:projectId/tasks
    // =========================================================================
    router.post("/projects/:projectId/tasks", authMiddleware, async (req, res) => {
      try {
        const  {projectId}  = req.params;

        console.log( "My Project ID : " + projectId);

        // Security Check: if project is logged in by the user
        const project = await Project.findOne({ _id: projectId, user: req.user._id });
        if (!project) {
          return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        
        const task = await Task.create({
          ...req.body,
          project: projectId, 
        });

        res.status(201).json(task);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // =========================================================================
    // 2. GET ALL TASKS OF A PROJECT
    // GET /api/projects/:projectId/tasks
    // =========================================================================
    router.get("/projects/:projectId/tasks", authMiddleware, async (req, res) => {
      try {
        const {projectId}  = req.params;

      
        const project = await Project.findOne({ _id: projectId, user: req.user._id });
        console.log(project);
        console.log("project : " + project);
        if (!project) {
          return res.status(404).json({ message: "Project not found or unauthorized" });
        }

      
        const tasks = await Task.find({ project: projectId });
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // =========================================================================
    // 3. UPDATE TASK 
    // // PUT /api/tasks/:taskId
    // =========================================================================
    router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
      try {
        const { taskId } = req.params;

  
        const task = await Task.findById(taskId);
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }

        
        const project = await Project.findOne({ _id: task.project, user: req.user._id });
        if (!project) {
          return res.status(403).json({ message: "Unauthorized to update tasks in this project" });
        }

      
        const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
          new: true,
          runValidators: true,
        });

        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // =========================================================================
    // 4. DELETE TASK
    // DELETE /api/tasks/:taskId
    // =========================================================================
    router.delete("/tasks/:taskId", authMiddleware, async (req, res) => {
      try {
        const { taskId } = req.params;

       
        const task = await Task.findById(taskId);
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }

       
        const project = await Project.findOne({ _id: task.project, user: req.user._id });
        if (!project) {
          return res.status(403).json({ message: "Unauthorized to delete tasks in this project" });
        }

        
        await Task.findByIdAndDelete(taskId);
        res.json({ message: "Task deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    module.exports = router;