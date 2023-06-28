const user = require("../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const register = async (req, res) => {
    try {
        console.log("Registering User ....");
        const { name, email, password, confirm_password } = req.body;
        if (password != confirm_password) {
            res.json({ status: "failure", msg: "password and confirm password does not match try again" })
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new user({
            name,
            email,
            password: passwordHash
        });
        const savedUser = await newUser.save();
        console.log("User registered Sucessfully");
        res.json({ status: "success", msg: "user registered sucessfully" });

    } catch (error) {
        res.json({ status: "failure", msg: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const curUser = await user.findOne({ email });
        const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24hrs from now
        if (!curUser) {
            return res.status(400).json({ status: 'failure', msg: "No user with this email" });
        }
        const isMatch = bcrypt.compare(password, curUser.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'failure', msg: "Invalid credentials" });
        }
        const token = jwt.sign({ id: curUser._id }, "test123456", { expiresIn: expirationTime });
        return res.status(200).json({ status: 'sucess', token });
    } catch (error) {
        res.json({ status: "failure", msg: error.message })
    }
}

module.exports = { register, login };