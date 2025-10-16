const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, expenseController.createExpense);

router.get("/", authMiddleware, expenseController.getAllExpenses);
router.get("/:id", authMiddleware, expenseController.getExpenseByUserId);

module.exports = router;
