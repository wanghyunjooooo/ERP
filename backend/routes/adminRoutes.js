const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

router.put("/attend/approval/:id", authMiddleware, adminController.approveAttend);

module.exports = router;
