const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/playlist', require('./playlist'));

module.exports = router;