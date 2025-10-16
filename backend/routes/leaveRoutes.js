const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, leaveController.createLeave);

module.exports = router;
