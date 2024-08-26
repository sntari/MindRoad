const mysql = require('mysql2');

// MySQL 연결 정보 설정
const db_info = {
  host: 'project-db-cgi.smhrd.com',
  port: 3307,
  user: 'mindload',
  password: 'mind1234!',
  database: 'mindload'
};


// mysql 중복여부 확인시 필요
const pool = mysql.createPool({
  host: 'project-db-cgi.smhrd.com',
  port: 3307,
  user: 'mindload',
  password: 'mind1234!',
  database: 'mindload'
});

const promisePool = pool.promise();


module.exports = {
  getConnection: () => promisePool.getConnection(),    // mysql 중복여부 확인시 필요
    connect: async function() {
        console.log('mysql 연결 성공');
        return mysql.createConnection(db_info);
    }
}