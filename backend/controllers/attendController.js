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
