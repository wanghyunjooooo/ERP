const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

exports.signup = async (req, res) => {
    const { user_name, user_email, user_password, user_auth, birthday, join_date, dept_id } = req.body;

    if (!user_name || !user_email || !user_password || !user_auth || !birthday || !join_date || !dept_id) {
        return res.status(400).json({ error: "모든 필드를 입력해주세요." });
    }

    try {
        const existing = await userModel.findUserByEmail(user_email);
        if (existing) {
            return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
        }

        const hashed = await bcrypt.hash(user_password, 10);

        const user = await userModel.createUser(user_name, user_email, hashed, user_auth, birthday, join_date, dept_id);

        const token = jwt.sign({ user_id: user.user_id, user_name: user.user_name, user_auth: user.user_auth }, process.env.JWT_KEY, { expiresIn: "7d" });

        res.status(201).json({
            message: "회원가입 성공",
            user,
            token,
        });
    } catch (err) {
        console.error("회원가입 오류:", err);
        res.status(500).json({ error: "회원가입 실패" });
    }
};

exports.login = async (req, res) => {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
        return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
    }

    try {
        const user = await userModel.findUserByEmail(user_email);
        if (!user) return res.status(400).json({ error: "존재하지 않는 사용자입니다." });

        const match = await bcrypt.compare(user_password, user.user_password);
        if (!match) return res.status(400).json({ error: "비밀번호가 틀렸습니다." });

        const token = jwt.sign({ user_id: user.user_id, user_name: user.user_name, user_auth: user.user_auth }, process.env.JWT_KEY, { expiresIn: "7d" });

        res.json({ message: "로그인 성공", user, token });
    } catch (err) {
        console.error("로그인 오류:", err);
        res.status(500).json({ error: "로그인 실패" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error("사원 조회 오류:", err);
        res.status(500).json({
            error: "사원 조회 실패",
        });
    }
};
