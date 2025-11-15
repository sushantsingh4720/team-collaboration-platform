const { Router } = require("express");
const auth = require("./auth");
const router = Router();
const { auth: authMiddlerware } = require("../../middlewares/user/auth");
const { allUsers } = require("../../controllers/user");
router.use("/auth", auth);
router.get("/", authMiddlerware, allUsers);
module.exports = router;
