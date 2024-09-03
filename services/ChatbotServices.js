const mysql = require('../config/mysql');

class ChatbotServices {
    static async ChatbotSentiment(user, questions, sentiment) {
      let connection = await mysql.connect();
      try {
        const query = `
          INSERT INTO SCORE_DATA
          (NICKNAME, QUESTIONS, GOOD, BAD, CENTER, NONE) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
          user, 
          questions, 
          sentiment.긍정,
          sentiment.부정,
          sentiment.중립,
          sentiment.없음
        ];
        
        const [result] = await connection.promise().query(query, values);
        return result;
      } catch (error) {
        console.error('Error saving chatbot response:', error);
        throw error;
      } finally {
        connection.end();
      }
    }
  }
  
  module.exports = ChatbotServices;