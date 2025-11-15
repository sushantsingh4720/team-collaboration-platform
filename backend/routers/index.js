const { Router } = require("express");

const router = Router();

const messageRouter = require("./message");
const projectRouter = require("./project");
const taskRouter = require("./task");
const teamRouter = require("./team");
const userRouter = require("./user");

router.use("/messages", messageRouter);
router.use("/projects", projectRouter);
router.use("/tasks", taskRouter);
router.use("/teams", teamRouter);
router.use("/user", userRouter);

module.exports = router;
