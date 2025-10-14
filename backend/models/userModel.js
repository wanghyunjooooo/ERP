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
