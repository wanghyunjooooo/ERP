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

exports.getAllLeaves = async () => {
    const result = await pool.query(`
        SELECT 
            l.leave_id,
            l.user_id,
            u.user_name,
            u.user_email,
            d.dept_name,
            l.start_date,
            l.end_date,
            l.reason,
            l.leave_type,
            l.approval_status,
            l.applied_at,
            l.approved_by
        FROM "Leave" l
        JOIN "User" u ON l.user_id = u.user_id
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        ORDER BY l.applied_at DESC
    `);
    return result.rows;
};
