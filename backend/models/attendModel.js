const pool = require("../config/db");

exports.findAttendByDate = async (user_id, attend_date) => {
    const result = await pool.query(
        `SELECT * FROM "Attend"
        WHERE user_id = $1 AND attend_date = $2
        ORDER BY attend_id DESC LIMIT 1`,
        [user_id, attend_date]
    );
    return result.rows[0];
};

exports.createStartWork = async (user_id, attend_date) => {
    const result = await pool.query(
        `
        INSERT INTO "Attend" (user_id, attend_date, start_time, status, approval_status)
        VALUES ($1, $2, NOW()::time, '출근', '대기')
        RETURNING attend_id, user_id, attend_date, start_time, status, approval_status
        `,
        [user_id, attend_date]
    );
    return result.rows[0];
};

exports.createEndWork = async (user_id, attend_date) => {
    const startRes = await pool.query(
        `
        SELECT start_time FROM "Attend"
        WHERE user_id = $1 AND attend_date = $2 AND status = '출근'
        ORDER BY attend_id DESC LIMIT 1
        `,
        [user_id, attend_date]
    );

    const start_time = startRes.rows[0]?.start_time;
    let total_hours = null;

    if (start_time) {
        const diff = (new Date(`1970-01-01T${new Date().toISOString().split("T")[1].split(".")[0]}Z`) - new Date(`1970-01-01T${start_time}Z`)) / 3600000;
        total_hours = Math.max(diff, 0).toFixed(2);
    }

    const result = await pool.query(
        `
        INSERT INTO "Attend" (user_id, attend_date, end_time, total_hours, status, approval_status)
        VALUES ($1, $2, NOW()::time, $3, '퇴근', '대기')
        RETURNING attend_id, user_id, attend_date, end_time, total_hours, status, approval_status
        `,
        [user_id, attend_date, total_hours]
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

exports.getAllStatus = async (targetDate) => {
    const result = await pool.query(
        `
        SELECT 
            u.user_id,
            u.user_name,
            d.dept_name,
            a.attend_date,
            a.start_time,
            a.end_time,
            a.total_hours,
            a.status,
            a.approval_status
        FROM "User" u
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        LEFT JOIN "Attend" a 
            ON u.user_id = a.user_id 
            AND a.attend_date = $1
        ORDER BY d.dept_name, u.user_name
    `,
        [targetDate]
    );

    return result.rows.map((row) => ({
        user_id: row.user_id,
        user_name: row.user_name,
        dept_name: row.dept_name,
        attend_date: row.attend_date || targetDate,
        start_time: row.start_time,
        end_time: row.end_time,
        total_hours: row.total_hours,
        status: row.start_time ? (row.end_time ? "퇴근" : "출근") : "미출근",
        approval_status: row.approval_status || "없음",
    }));
};

exports.getStatusByUserId = async (user_id, targetDate) => {
    const result = await pool.query(
        `
        SELECT 
            u.user_id,
            u.user_name,
            d.dept_name,
            a.attend_date,
            a.start_time,
            a.end_time,
            a.total_hours,
            a.status,
            a.approval_status
        FROM "User" u
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        LEFT JOIN "Attend" a 
            ON u.user_id = a.user_id 
            AND a.attend_date = $2
        WHERE u.user_id = $1
        `,
        [user_id, targetDate]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
        user_id: row.user_id,
        user_name: row.user_name,
        dept_name: row.dept_name,
        attend_date: row.attend_date || targetDate,
        start_time: row.start_time,
        end_time: row.end_time,
        total_hours: row.total_hours,
        status: row.start_time ? (row.end_time ? "퇴근" : "출근") : "미출근",
        approval_status: row.approval_status || "없음",
    };
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
