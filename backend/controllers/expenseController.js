const expenseModel = require("../models/expenseModels");
const fs = require("fs");

exports.createExpense = async (req, res) => {
    const user_id = req.user.user_id;
    const { amount, category, description, dept_id } = req.body;
    const receiptFile = req.file ? req.file.filename : null;

    if (!amount || !dept_id || !receiptFile) {
        return res.status(400).json({ error: "금액(amount)과 부서(dept_id), 영수증(receiptFile)는 필수입니다" });
    }

    try {
        const expense = await expenseModel.createExpense(user_id, dept_id, amount, category, description, receiptFile);
        res.status(201).json({ message: "지출 신청이 완료되었습니다", expense });
    } catch (err) {
        console.error("지출 신청 오류:", err);
        res.status(500).json({ error: "지출 신청 실패" });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseModel.getAllExpenses();
        if (expenses.length === 0) console.log("연차 내역이 없습니다");
        res.json(expenses);
    } catch (err) {
        console.error("전체 지출 조회 오류:", err);
        res.status(500).json({ error: "지출 전체 조회 실패" });
    }
};

exports.getExpenseByUserId = async (req, res) => {
    const user_id = parseInt(req.params.id);

    try {
        const expenses = await expenseModel.getExpenseByUserId(user_id);
        if (expenses.length === 0) console.log("해당 사원의 연차 내역이 없습니다");
        res.json(expenses);
    } catch (err) {
        console.error("지출 내역 조회 오류:", err);
        res.status(500).json({ error: "지출 내역 조회 실패" });
    }
};
