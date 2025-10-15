const pool = require("../config/db");

exports.findAttendByDate = async (user_id, attend_date) => {
    const result = await pool.query(`SELECT * FROM "Attend" WHERE user_id = $1 AND attend_date = $2`, [user_id, attend_date]);
    return result.rows[0];
};

exports.createStartWork = async (user_id, attend_date) => {
    const result = await pool.query(
        `
        INSERT INTO "Attend" (user_id, attend_date, start_time, status, approval_status)
        VALUES ($1, $2, NOW()::time, '근무중', '대기')
        RETURNING attend_id, user_id, attend_date, start_time, status, approval_status
        `,
        [user_id, attend_date]
    );
    return result.rows[0];
};

exports.updateEndWork = async (user_id, attend_date) => {
    const result = await pool.query(
        `
        UPDATE "Attend"
        SET 
            end_time = NOW()::time,
            total_hours = EXTRACT(EPOCH FROM (NOW()::time - start_time)) / 3600,
            status = '퇴근'
        WHERE user_id = $1 AND attend_date = $2
        RETURNING attend_id, user_id, attend_date, start_time, end_time, total_hours, status
        `,
        [user_id, attend_date]
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

exports.getWeeklySummary = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            DATE_TRUNC('week', attend_date) AS week,
            SUM(total_hours) AS total_hours
        FROM "Attend"
        WHERE user_id = $1 AND approval_status = '승인'
        GROUP BY week
        ORDER BY week DESC
        LIMIT 1;
    `,
        [user_id]
    );
    return result.rows[0] || { total_hours: 0 };
};

exports.getApprovalStatus = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            attend_id,
            attend_date,
            approval_status,
            approved_by
        FROM "Attend"
        WHERE user_id = $1
        ORDER BY attend_date DESC;
    `,
        [user_id]
    );
    return result.rows;
};
