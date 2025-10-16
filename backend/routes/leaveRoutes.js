const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, leaveController.createLeave);

router.get("/", authMiddleware, leaveController.getAllLeaves);

module.exports = router;
