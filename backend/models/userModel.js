const pool = require("../config/db");

exports.createUser = async (user_name, user_email, user_password, user_auth, birthday, join_date, dept_id) => {
    const result = await pool.query(
        `INSERT INTO "User" (user_name, user_password, user_email, user_auth, birthday, join_date, dept_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING user_id, user_name, user_email, user_auth, join_date, dept_id, created_at`,
        [user_name, user_password, user_email, user_auth, birthday, join_date, dept_id]
    );
    return result.rows[0];
};

exports.findUserByEmail = async (user_email) => {
    const result = await pool.query(
        `SELECT * 
        FROM "User"
        WHERE user_email = $1`,
        [user_email]
    );
    return result.rows[0];
};

exports.getAllUsers = async () => {
    const result = await pool.query(`
        SELECT 
            u.user_id,
            u.user_name,
            u.user_email,
            u.user_auth,
            u.birthday,
            u.join_date,
            d.dept_name,
            u.created_at
        FROM "User" u
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        ORDER BY u.user_id ASC
    `);
    return result.rows;
};

exports.getUserById = async (user_id) => {
    const result = await pool.query(
        `
        SELECT 
            u.user_id,
            u.user_name,
            u.user_email,
            u.user_auth,
            u.birthday,
            u.join_date,
            d.dept_name,
            u.created_at
        FROM "User" u
        LEFT JOIN "Dept" d ON u.dept_id = d.dept_id
        WHERE u.user_id = $1
        `,
        [user_id]
    );

    return result.rows[0];
};

exports.updateUserAuth = async (user_id, user_auth) => {
    const result = await pool.query(
        `UPDATE "User"
        SET user_auth = $1
        WHERE user_id = $2
        RETURNING user_id, user_name, user_email, user_auth`,
        [user_auth, user_id]
    );
    return result.rows[0];
};
