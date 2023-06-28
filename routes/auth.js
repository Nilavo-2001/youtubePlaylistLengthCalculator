const express = require('express');
const { register, login } = require('../controllers/auth');
const router = express.Router();
// to register
router.post('/register', register);

//to login
router.post('/login', login);

module.exports = router;