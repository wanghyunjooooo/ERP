const pool = require("../config/db");

exports.createAttend = async (user_id, attend_date, start_time, end_time, status = "근무") => {
    let total_hours = null;
    if (start_time && end_time) {
        const diff = (new Date(`1970-01-01T${end_time}Z`) - new Date(`1970-01-01T${start_time}Z`)) / 3600000;
        total_hours = parseFloat(diff.toFixed(2));
    }

    const result = await pool.query(
        `
        INSERT INTO "Attend" (user_id, attend_date, start_time, end_time, total_hours, status, approval_status)
        VALUES ($1, $2, $3, $4, $5, $6, '대기')
        RETURNING attend_id, user_id, attend_date, start_time, end_time, total_hours, status, approval_status
        `,
        [user_id, attend_date, start_time, end_time, total_hours, status]
    );
    return result.rows[0];
};

exports.getAllAttends = async () => {
    const result = await pool.query(`
        SELECT 
            a.attend_id,
            a.user_id,
            u.user_name,
            d.dept_name,
            a.attend_date,
            a.start_time,
            a.end_time,
            a.total_hours,
            a.status,
            a.approval_status,
            a.approved_by
        FROM "Attend" a
        JOIN "User" u ON a.user_id = u.user_id
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        ORDER BY a.attend_date DESC;
    `);
    return result.rows;
};

exports.getAttendByUserId = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            attend_id, attend_date, start_time, end_time, total_hours, status, approval_status
        FROM "Attend"
        WHERE user_id = $1
        ORDER BY attend_date DESC;
    `,
        [user_id]
    );
    return result.rows;
};

exports.getMonthlySummary = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            DATE_TRUNC('month', attend_date) AS month,
            SUM(total_hours) AS total_hours
        FROM "Attend"
        WHERE user_id = $1 AND approval_status = '승인'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 1;
    `,
        [user_id]
    );
    return result.rows[0] || { total_hours: 0 };
};
