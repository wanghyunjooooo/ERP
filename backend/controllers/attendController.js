const attendModel = require("../models/attendModel");

exports.startWork = async (req, res) => {
    const user_id = req.user.user_id;
    const today = new Date().toISOString().split("T")[0];

    try {
        const existing = await attendModel.findAttendByDate(user_id, today);
        if (existing) {
            return res.status(400).json({ error: "이미 출근 기록이 존재합니다" });
        }

        const attend = await attendModel.createStartWork(user_id, today);
        res.status(201).json({ message: "출근이 등록되었습니다", attend });
    } catch (err) {
        console.error("출근 등록 오류:", err);
        res.status(500).json({ error: "출근 등록 실패" });
    }
};

exports.endWork = async (req, res) => {
    const user_id = req.user.user_id;
    const today = new Date().toISOString().split("T")[0];

    try {
        const existing = await attendModel.findAttendByDate(user_id, today);
        if (!existing) {
            return res.status(400).json({ error: "출근 기록이 없습니다" });
        }

        if (existing.end_time) {
            return res.status(400).json({ error: "이미 퇴근이 완료되었습니다" });
        }

        const updated = await attendModel.updateEndWork(user_id, today);
        res.json({ message: "퇴근이 등록되었습니다", attend: updated });
    } catch (err) {
        console.error("퇴근 등록 오류:", err);
        res.status(500).json({ error: "퇴근 등록 실패" });
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

exports.getAllStatus = async (req, res) => {
    try {
        if (req.user.user_auth !== "관리자") {
            return res.status(403).json({ error: "관리자 권한이 필요합니다" });
        }

        const date = req.query.date || new Date().toISOString().split("T")[0];
        const status = await attendModel.getAllStatus(date);
        res.json({
            date,
            total: status.length,
            employees: status,
        });
    } catch (err) {
        console.error("근무 현황 조회 오류:", err);
        res.status(500).json({ error: "근무 현황 조회 실패" });
    }
};

exports.getStatusByUserId = async (req, res) => {
    const user_id = parseInt(req.params.id);

    try {
        if (req.user.user_auth !== "관리자" && req.user.user_id !== user_id) {
            return res.status(403).json({ error: "본인 또는 관리자만 조회할 수 있습니다" });
        }

        const date = req.query.date || new Date().toISOString().split("T")[0];
        const status = await attendModel.getStatusByUserId(user_id, date);

        if (!status) {
            return res.status(404).json({ error: "해당 날짜의 근무 기록이 없습니다" });
        }

        res.json(status);
    } catch (err) {
        console.error("개인 근무 현황 조회 오류:", err);
        res.status(500).json({ error: "개인 근무 현황 조회 실패" });
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

exports.getWeeklySummary = async (req, res) => {
    const user_id = parseInt(req.params.id);
    try {
        const summary = await attendModel.getWeeklySummary(user_id);
        res.json(summary);
    } catch (err) {
        console.error("주간 근무시간 조회 오류:", err);
        res.status(500).json({ error: "주간 근무시간 조회 실패" });
    }
};

exports.getApprovalStatus = async (req, res) => {
    const user_id = parseInt(req.params.user_id);
    try {
        const approvals = await attendModel.getApprovalStatus(user_id);
        res.json(approvals);
    } catch (err) {
        console.error("승인 내역 조회 오류:", err);
        res.status(500).json({ error: "승인 내역 조회 실패" });
    }
};
