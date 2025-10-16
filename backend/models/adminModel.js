const pool = require("../config/db");

exports.updateAttendApproval = async (attend_id, approved_by, approval_status) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const attendRes = await client.query(
            `UPDATE "Attend"
            SET approval_status = $1,
                approved_by = $2
            WHERE attend_id = $3
            RETURNING attend_id, user_id, approval_status, approved_by`,
            [approval_status, approved_by, attend_id]
        );

        const attend = attendRes.rows[0];

        await client.query(
            `INSERT INTO "Approval" (user_id, approved_by, target_type, target_id, status, approved_at)
            VALUES ($1, $2, 'Attend', $3, $4, NOW())`,
            [attend.user_id, approved_by, attend_id, approval_status]
        );

        await client.query("COMMIT");
        return attend;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

exports.updateLeaveApproval = async (leave_id, approved_by, approval_status) => {
    const result = await pool.query(
        `UPDATE "Leave"
        SET approval_status = $1,
            approved_by = $2
        WHERE leave_id = $3
        RETURNING leave_id, user_id, approval_status, approved_by`,
        [approval_status, approved_by, leave_id]
    );
    return result.rows[0];
};
