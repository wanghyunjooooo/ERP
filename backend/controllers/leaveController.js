const leaveModel = require("../models/leaveModel");

exports.createLeave = async (req, res) => {
    const user_id = req.user.user_id;
    const { start_date, end_date, reason, leave_type } = req.body;

    if (!start_date || !end_date || !leave_type) {
        return res.status(400).json({ error: "필수 항목(시작일, 종료일, 연차 유형)을 입력해주세요." });
    }

    try {
        const leave = await leaveModel.createLeave(user_id, start_date, end_date, reason, leave_type);
        res.status(201).json({ message: "연차 신청이 완료되었습니다.", leave });
    } catch (err) {
        console.error("연차 신청 오류:", err);
        res.status(500).json({ error: "연차 신청 실패" });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await leaveModel.getAllLeaves();
        res.json(leaves);
    } catch (err) {
        console.error("전체 연차 조회 오류:", err);
        res.status(500).json({ error: "전체 연차 조회 실패" });
    }
};
