const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

router.put("/attend/approval/:id", authMiddleware, adminController.approveAttend);
router.put("/leave/approval/:id", authMiddleware, adminController.approveLeave);
router.put("/expense/approval/:id", authMiddleware, adminController.approveExpense);

module.exports = router;
