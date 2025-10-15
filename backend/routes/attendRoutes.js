const express = require("express");
const router = express.Router();
const attendController = require("../controllers/attendController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, attendController.createAttend);

router.get("/", authMiddleware, attendController.getAllAttends);

router.get("/:id", authMiddleware, attendController.getAttendByUserId);

router.get("/summary/monthly/:id", authMiddleware, attendController.getMonthlySummary);

router.get("/summary/weekly/:id", authMiddleware, attendController.getWeeklySummary);

router.get("/approval/:user_id", authMiddleware, attendController.getApprovalStatus);

module.exports = router;
