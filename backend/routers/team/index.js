const express = require("express");
const { auth } = require("../../middlewares/user/auth");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../../controllers/task");
const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
