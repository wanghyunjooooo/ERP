const attendModel = require("../models/attendModel");

exports.createAttend = async (req, res) => {
    const user_id = req.user.user_id;
    const { attend_date, start_time, end_time, status } = req.body;

    if (!attend_date) {
        return res.status(400).json({ error: "attend_date는 필수입니다" });
    }

    try {
        const attend = await attendModel.createAttend(user_id, attend_date, start_time, end_time, status);
        res.status(201).json({ message: "출퇴근 요청 등록", attend });
    } catch (err) {
        console.error("출퇴근 등록 오류:", err);
        res.status(500).json({ error: "출퇴근 등록 실패" });
    }
};

exports.getAllAttends = async (req, res) => {
    try {
        const attends = await attendModel.getAllAttends();
        res.json(attends);
    } catch (err) {
        console.error("전체 출퇴근 조회 오류:", err);
        res.status(500).json({ error: "출퇴근 전체 조회 실패" });
    }
};

exports.getAttendByUserId = async (req, res) => {
    const user_id = parseInt(req.params.id);
    try {
        const attends = await attendModel.getAttendByUserId(user_id);
        if (attends.length === 0) return res.status(404).json({ error: "출퇴근 내역이 없습니다" });
        res.json(attends);
    } catch (err) {
        console.error("개별 출퇴근 조회 오류:", err);
        res.status(500).json({ error: "출퇴근 내역 조회 실패" });
    }
};

exports.getMonthlySummary = async (req, res) => {
    const user_id = parseInt(req.params.id);
    try {
        const summary = await attendModel.getMonthlySummary(user_id);
        res.json(summary);
    } catch (err) {
        console.error("월간 근무시간 조회 오류:", err);
        res.status(500).json({ error: "월간 근무시간 조회 실패" });
    }
};
