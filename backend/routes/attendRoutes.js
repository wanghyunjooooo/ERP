const express = require("express");
const router = express.Router();
const attendController = require("../controllers/attendController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, attendController.createAttend);

router.get("/", authMiddleware, attendController.getAllAttends);

router.get("/:id", authMiddleware, attendController.getAttendByUserId);

module.exports = router;
