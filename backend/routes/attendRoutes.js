const express = require("express");
const router = express.Router();
const attendController = require("../controllers/attendController");
const authMiddleware = require("../middleware/auth");

router.post("/start", authMiddleware, attendController.startWork);
router.post("/end", authMiddleware, attendController.endWork);

router.get("/", authMiddleware, attendController.getAllAttends);

router.get("/status", authMiddleware, attendController.getAllStatus);

router.get("/summary/monthly/:id", authMiddleware, attendController.getMonthlySummary);
router.get("/summary/weekly/:id", authMiddleware, attendController.getWeeklySummary);

router.get("/approval/:user_id", authMiddleware, attendController.getApprovalStatus);

router.get("/:id", authMiddleware, attendController.getAttendByUserId);

module.exports = router;
