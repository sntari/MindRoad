const ChatbotServices = require('../services/ChatbotServices');

class ChatbotController {
  static async handleChatbotResponse(req, res) {
    try {
      const { user, questions, sentiment } = req.body;
      const insertId = await ChatbotServices.ChatbotSentiment(user, questions, sentiment);
      
      res.status(201).json({ message: 'Chatbot response saved successfully', id: insertId });
    } catch (error) {
      console.error('Error in handleChatbotResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ChatbotController;