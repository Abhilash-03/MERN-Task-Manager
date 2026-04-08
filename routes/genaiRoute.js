const express = require('express');
const { genai, generateTask, getDailyMotivation, getSmartSuggestions, breakdownTask } = require('../controllers/genai');
const router = express.Router();

router.route('/genai').post(genai);
router.route('/generate-task').post(generateTask);
router.route('/motivation').post(getDailyMotivation);
router.route('/suggestions').post(getSmartSuggestions);
router.route('/breakdown').post(breakdownTask);

module.exports =  router;