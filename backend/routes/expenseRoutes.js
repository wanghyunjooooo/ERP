const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, expenseController.createExpense);

module.exports = router;
