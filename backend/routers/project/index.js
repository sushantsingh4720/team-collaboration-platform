const express = require("express");
const { auth, authorize } = require("../../middlewares/user/auth");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../../controllers/project");
const router = express.Router();

router.get("/", auth, getProjects);
router.post("/", auth, authorize("ADMIN", "MANAGER"), createProject);
router.put("/:id", auth, authorize("ADMIN", "MANAGER"), updateProject);
router.delete("/:id", auth, authorize("ADMIN"), deleteProject);

module.exports = router;
