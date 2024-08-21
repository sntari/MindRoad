const mysql = require('mysql2');

// MySQL 연결 정보 설정
const db_info = {
  host: 'project-db-cgi.smhrd.com',
  port: 3307,
  user: 'mindload',
  password: 'mind1234!',
  database: 'mindload'
};

module.exports = {
    connect: async function() {
        console.log('mysql 연결 성공');
        return mysql.createConnection(db_info);
    }
}