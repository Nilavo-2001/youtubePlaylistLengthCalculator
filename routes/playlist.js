const express = require('express');
const fetchTime = require('../controllers/playlist');
const router = express.Router();

// fetch the playlist time
router.get('/time', fetchTime)

module.exports = router;