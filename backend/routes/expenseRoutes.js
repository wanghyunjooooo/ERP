const express = require("express");
const multer = require("multer");

const router = express.Router();
const path = require("path");
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("receipt"), expenseController.createExpense);

router.get("/", authMiddleware, expenseController.getAllExpenses);
router.get("/:id", authMiddleware, expenseController.getExpenseByUserId);

module.exports = router;
