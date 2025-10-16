const pool = require("../config/db");

exports.getAllLogs = async () => {
    const result = await pool.query(`
        SELECT 
            l.log_id,
            l.user_id,
            u.user_name,
            u.user_email,
            d.dept_name,
            l.login_time,
            l.logout_time,
            l.ip_address
        FROM "Log" l
        LEFT JOIN "User" u ON l.user_id = u.user_id
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        ORDER BY l.login_time DESC
    `);
    return result.rows;
};

exports.createLoginLog = async (user_id, ip_address) => {
    await pool.query(
        `INSERT INTO "Log" (user_id, login_time, ip_address)
        VALUES ($1, NOW(), $2)`,
        [user_id, ip_address]
    );
};
