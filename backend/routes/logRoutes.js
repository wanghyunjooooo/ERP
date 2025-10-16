const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, logController.getAllLogs);
router.get("/:id", authMiddleware, logController.getLogsByUserId);

module.exports = router;
