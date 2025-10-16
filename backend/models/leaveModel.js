const pool = require("../config/db");

exports.createLeave = async (user_id, start_date, end_date, reason, leave_type) => {
    const result = await pool.query(
        `
        INSERT INTO "Leave" (user_id, start_date, end_date, reason, leave_type, applied_at, approval_status)
        VALUES ($1, $2, $3, $4, $5, NOW(), '대기')
        RETURNING leave_id, user_id, start_date, end_date, reason, leave_type, approval_status, applied_at
        `,
        [user_id, start_date, end_date, reason, leave_type]
    );
    return result.rows[0];
};
