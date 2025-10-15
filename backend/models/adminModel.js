const pool = require("../config/db");

exports.updateAttendApproval = async (attend_id, approved_by, approval_status) => {
    const result = await pool.query(
        `UPDATE "Attend"
        SET approval_status = $1,
            approved_by = $2
        WHERE attend_id = $3
        RETURNING attend_id, user_id, approval_status, approved_by`,
        [approval_status, approved_by, attend_id]
    );
    return result.rows[0];
};
