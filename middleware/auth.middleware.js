const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ "message": "Token not found" });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        req.user = {
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            user_id: decoded.user_id
        };
        next();
    } catch (error) {
        res.status(401).send("Authorization is required");
    }
};

module.exports = auth;
