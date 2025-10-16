const adminModel = require("../models/adminModel");

exports.approveAttend = async (req, res) => {
    const attend_id = parseInt(req.params.id);
    const { approval_status } = req.body;
    const approved_by = req.user.user_id;

    if (!["승인", "거절", "지각"].includes(approval_status)) {
        return res.status(400).json({ error: "올바르지 않습니다" });
    }

    try {
        const result = await adminModel.updateAttendApproval(attend_id, approved_by, approval_status);
        if (!result) return res.status(404).json({ error: "출퇴근 기록을 찾을 수 없습니다" });

        res.json({ message: "출퇴근 승인 상태가 변경되었습니다", result });
    } catch (err) {
        console.error("출퇴근 승인 오류:", err);
        res.status(500).json({ error: "출퇴근 승인 실패" });
    }
};

exports.approveLeave = async (req, res) => {
    const leave_id = parseInt(req.params.id);
    const { approval_status } = req.body;
    const approved_by = req.user.user_id;

    if (!["승인", "거절"].includes(approval_status)) {
        return res.status(400).json({ error: "approval_status는 '승인' 또는 '거절'만 가능합니다" });
    }

    try {
        const result = await adminModel.updateLeaveApproval(leave_id, approved_by, approval_status);
        if (!result) return res.status(404).json({ error: "해당 연차 신청을 찾을 수 없습니다" });

        res.json({ message: "연차 승인 상태가 변경되었습니다", result });
    } catch (err) {
        console.error("연차 승인 오류:", err);
        res.status(500).json({ error: "연차 승인 실패" });
    }
};
