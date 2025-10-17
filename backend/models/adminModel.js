const pool = require("../config/db");

exports.updateAttendApproval = async (attend_id, approved_by, approval_status) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const attendInfo = await client.query(`SELECT user_id, status FROM "Attend" WHERE attend_id = $1`, [attend_id]);
        const attend = attendInfo.rows[0];
        if (!attend) throw new Error("Attend 기록을 찾을 수 없습니다");

        await client.query(
            `UPDATE "Attend"
            SET approval_status = $1,
                approved_by = $2
            WHERE attend_id = $3`,
            [approval_status, approved_by, attend_id]
        );

        if (approval_status === "승인" || approval_status === "지각") {
            if (attend.status === "출근 대기") {
                await client.query(
                    `UPDATE "Attend"
                    SET status = '출근'
                    WHERE attend_id = $1`,
                    [attend_id]
                );
            } else if (attend.status === "퇴근 대기") {
                await client.query(
                    `UPDATE "Attend"
                    SET status = '퇴근'
                    WHERE attend_id = $1`,
                    [attend_id]
                );
            }
        } else if (approval_status === "거절") {
            if (attend.status === "출근 대기") {
                await client.query(
                    `UPDATE "Attend"
                    SET status = '미출근'
                    WHERE attend_id = $1`,
                    [attend_id]
                );
            } else if (attend.status === "퇴근 대기") {
                await client.query(
                    `UPDATE "Attend"
                    SET status = '출근'
                    WHERE attend_id = $1`,
                    [attend_id]
                );
            }
        }

        await client.query(
            `INSERT INTO "Approval" (user_id, approved_by, target_type, target_id, status, approved_at)
            VALUES ($1, $2, 'Attend', $3, $4, NOW())`,
            [attend.user_id, approved_by, attend_id, approval_status]
        );

        await client.query("COMMIT");
        return { message: "출퇴근 승인 처리 완료", attend_id, approval_status };
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

exports.updateExpenseApproval = async (expense_id, approved_by, approval_status) => {
    const result = await pool.query(
        `UPDATE "Expense"
        SET approval_status = $1,
            approved_by = $2
        WHERE expense_id = $3
        RETURNING expense_id, user_id, approval_status, approved_by`,
        [approval_status, approved_by, expense_id]
    );
    return result.rows[0];
};
