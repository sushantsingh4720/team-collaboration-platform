const express = require("express");
const { auth } = require("../../middlewares/user/auth");
const { getMessages, sendMessage } = require("../../controllers/message");
const router = express.Router();

router.get("/", auth, getMessages);
router.post("/", auth, sendMessage);

module.exports = router;
