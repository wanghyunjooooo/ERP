const pool = require("../config/db");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error("auth: Authorization header missing");
            return res.status(401).json({ error: "토큰이 제공되지 않았습니다" });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            console.error("auth: Invalid authorization header format", authHeader);
            return res.status(401).json({ error: "토큰 형식이 올바르지 않습니다" });
        }

        const token = parts[1];
        const secret = process.env.JWT_KEY;
        if (!secret) {
            console.error("auth: JWT_KEY is not set");
            return res.status(500).json({ error: "서버 설정 오류" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (err) {
            console.error("auth: jwt.verify failed:", err.message);
            return res.status(401).json({ error: "토큰이 유효하지 않습니다" });
        }

        if (!decoded.user_id || !decoded.user_name) {
            console.error("auth: decoded missing required fields", decoded);
            return res.status(401).json({ error: "토큰 정보가 손상되었습니다" });
        }

        const { rows } = await pool.query(`SELECT user_id, user_auth FROM "User" WHERE user_id = $1`, [decoded.user_id]);
        if (rows.length === 0) {
            console.error("auth: user not found", decoded.user_id);
            return res.status(403).json({ error: "존재하지 않는 사용자입니다" });
        }

        const dbUser = rows[0];
        if (dbUser.user_auth !== decoded.user_auth) {
            console.error("auth: user_auth mismatch", { db: dbUser.user_auth, token: decoded.user_auth });
            return res.status(403).json({ error: "권한 정보 불일치" });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        console.error("auth: unexpected error", err);
        return res.status(500).json({ error: "서버 오류" });
    }
};
