const { Router } = require("express");
const { auth } = require("../../middlewares/user/auth");
const { getProfile, register } = require("../../controllers/user");

const router = Router();

router.post("/register", register);

router.get("/", auth, getProfile);

module.exports = router;
