const mysql = require('mysql2');

// MySQL 연결 정보 설정
const dbConfig = {
  host: 'project-db-cgi.smhrd.com',
  port: 3307,
  user: 'mindload',
  password: 'mind1234!'
};

// MySQL 연결 객체 생성
const connection = mysql.createConnection(dbConfig);

// MySQL 연결 함수
function connectToDatabase() {
  connection.connect((err) => {
    if (err) {
      console.error('MySQL 연결 오류:', err);
      return;
    }
    console.log('MySQL에 성공적으로 연결되었습니다!');
  });
}

// 연결 객체와 연결 함수 내보내기
module.exports = {
  connection,
  connectToDatabase
};
