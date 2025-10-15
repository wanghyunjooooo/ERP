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
