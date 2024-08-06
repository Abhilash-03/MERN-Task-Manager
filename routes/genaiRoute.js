const express = require('express');
const genai = require('../controllers/genai');
const router = express.Router();

router.route('/genai').post(genai);

module.exports =  router;