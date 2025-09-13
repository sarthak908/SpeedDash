const express = require('express');
const router = express.Router();
// FIX: Change 'openAiController' to 'openAIController'
const { generateChartData } = require('../controllers/geminiController');
router.post('/generate-chart', generateChartData);
module.exports = router;