const pool = require("../config/db");

exports.createExpense = async (user_id, dept_id, amount, category, description, receiptFile) => {
    const result = await pool.query(
        `
        INSERT INTO "Expense" (user_id, dept_id, amount, category, description, receipt, created_at, approval_status)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), '대기')
        RETURNING expense_id, user_id, dept_id, amount, category, description, receipt, approval_status, created_at
        `,
        [user_id, dept_id, amount, category, description, receiptFile]
    );
    return result.rows[0];
};

exports.getAllExpenses = async () => {
    const result = await pool.query(`
        SELECT 
            e.expense_id,
            e.user_id,
            u.user_name,
            d.dept_name,
            e.amount,
            e.category,
            e.description,
            e.receipt,
            e.approval_status,
            e.created_at,
            e.approved_by
        FROM "Expense" e
        JOIN "User" u ON e.user_id = u.user_id
        LEFT JOIN "Dept" d ON e.dept_id = d.dept_id
        ORDER BY e.created_at DESC
    `);
    return result.rows;
};

exports.getExpenseByUserId = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            expense_id,
            amount,
            category,
            description,
            receipt,
            approval_status,
            created_at,
            approved_by
        FROM "Expense"
        WHERE user_id = $1
        ORDER BY created_at DESC
    `,
        [user_id]
    );
    return result.rows;
};
