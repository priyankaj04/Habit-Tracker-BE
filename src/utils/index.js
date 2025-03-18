const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").replace(/^Bearer\s+/, "");;
    if (!token) return res.status(401).json({ status: 0, error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 0, error: "Invalid token." });
    }
};

module.exports = { authenticate }