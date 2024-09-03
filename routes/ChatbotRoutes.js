const express = require('express');
const ChatbotController = require('../controllers/ChatbotController');

const router = express.Router();

router.post('/saveChatbotResponse', ChatbotController.handleChatbotResponse);

module.exports = router;