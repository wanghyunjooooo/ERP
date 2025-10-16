const logModel = require("../models/logModel");

exports.getAllLogs = async (req, res) => {
    try {
        if (req.user.user_auth !== "관리자") {
            return res.status(403).json({ error: "관리자 권한이 필요합니다" });
        }

        const logs = await logModel.getAllLogs();
        res.json(logs);
    } catch (err) {
        console.error("전체 로그 조회 오류:", err);
        res.status(500).json({ error: "전체 로그 조회 실패" });
    }
};
