const express = require('express');
const { register, login, logout, googleAuth } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googleAuth', googleAuth);
router.post('/logout', logout);

module.exports = router