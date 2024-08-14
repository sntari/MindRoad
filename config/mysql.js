const mysql = require('mysql2');

// 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'project-db-campus.smhrd.com', // 데이터베이스 호스트
    port: 3307,                            // 포트 번호
    user: 'mindload',                      // 데이터베이스 사용자 이름
    password: 'mind1234!',                 // 데이터베이스 비밀번호
    database: 'your_database'              // 사용할 데이터베이스 이름 (필요에 따라 수정)
});

// 연결 시도
connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err.stack);
        return;
    }
    console.log('데이터베이스에 연결됨:', connection.threadId);
});

// 예시: 쿼리 실행
connection.query('SELECT * FROM your_table', (error, results) => {
    if (error) {
        console.error('쿼리 실행 실패:', error);
        return;
    }
    console.log('결과:', results);
});

// 연결 종료 (필요할 때)
connection.end();
