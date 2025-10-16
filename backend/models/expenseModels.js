const pool = require("../config/db");

exports.createExpense = async (user_id, dept_id, amount, category, description) => {
    const result = await pool.query(
        `
        INSERT INTO "Expense" (user_id, dept_id, amount, category, description, created_at, approval_status)
        VALUES ($1, $2, $3, $4, $5, NOW(), '대기')
        RETURNING expense_id, user_id, dept_id, amount, category, description, approval_status, created_at
        `,
        [user_id, dept_id, amount, category, description]
    );
    return result.rows[0];
};
