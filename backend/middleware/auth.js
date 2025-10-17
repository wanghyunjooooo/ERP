const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "토큰이 제공되지 않았습니다" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY, {
            algorithms: ["HS256"],
        });

        if (!decoded.user_id || !decoded.user_name) {
            return res.status(401).json({ error: "토큰 정보가 손상되었습니다" });
        }

        const { rows } = await pool.query(`SELECT user_id, user_auth FROM "User" WHERE user_id = $1`, [decoded.user_id]);

        if (rows.length === 0) {
            return res.status(403).json({ error: "존재하지 않는 사용자입니다" });
        }

        const dbUser = rows[0];
        if (dbUser.user_auth !== decoded.user_auth) {
            return res.status(403).json({ error: "권한 정보 불일치" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT 인증 오류:", err.message);
        return res.status(401).json({ error: "토큰이 유효하지 않습니다" });
    }
};
