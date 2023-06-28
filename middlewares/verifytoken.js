const user = require("../models/users");
const jwt = require('jsonwebtoken');
const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(403).send("Access Denied");
        }
        token = token.slice(7, token.length).trimLeft();
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const curUser = await user.findById(verified.id);
        if (!curUser) {
            return res.status(403).send("Access Denied , ");
        }
        req.user = curUser;
        next();
    } catch (err) {
        res.json({ status: "failure", msg: err.message })
    }
};

module.exports = verifyToken;