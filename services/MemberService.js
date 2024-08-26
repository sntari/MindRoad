const mysql = require('../config/mysql'); // mysql.js 파일을 불러옴

// 회원가입
async function registerUser(mem_id, mem_pw, mem_nick) {
    const connection = await mysql.connect();
    try {
        const query = 'INSERT INTO MEMBERS (NICKNAME, EMAIL, PW, DATETIME) VALUES (?, ?, ?, ?)';
        const [result] = await connection.promise().query(query, [mem_nick,mem_id, mem_pw, new Date()]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}

// 로그인
async function loginUser(mem_id, mem_pw) {
    const connection = await mysql.connect();
    
    try {
        if(mem_id != ""){
            const query = 'SELECT * FROM MEMBERS WHERE EMAIL = ? AND PW = ?';
            const [rows] = await connection.promise().query(query, [mem_id, mem_pw]);
            return rows;
        }else{
            return 0;
        }
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}

// EMAIL 체크
async function checkEMAIL(EMAIL) {
    // 데이터베이스 연결 설정
    const connection = await mysql.getConnection(); // 데이터베이스 풀에서 연결 가져오기
    try {
        // 이메일을 조회하는 SQL 쿼리
        const [rows] = await connection.execute(
            'SELECT * FROM MEMBERS WHERE EMAIL = ?',
            [EMAIL]
        );
        // 이메일이 존재하는지 확인
        return rows.length > 0;
    } catch (error) {
        console.error("Database query error:", error);  // 로그에 상세 오류 출력
        throw error;  // 오류를 다시 던져서 상위 함수에서 처리하도록 함
    } finally {
        connection.release(); // 풀에서 연결 반환
    }
}

// NICKNAME 체크
async function checkNICK(NICK) {
    // 데이터베이스 연결 설정
    const connection = await mysql.getConnection(); // 데이터베이스 풀에서 연결 가져오기
    try {
        // 이메일을 조회하는 SQL 쿼리
        const [rows] = await connection.execute(
            'SELECT * FROM MEMBERS WHERE NICKNAME = ?',
            [NICK]
        );
        // 이메일이 존재하는지 확인
        return rows.length > 0;
    } catch (error) {
        console.error("Database query error:", error);  // 로그에 상세 오류 출력
        throw error;  // 오류를 다시 던져서 상위 함수에서 처리하도록 함
    } finally {
        connection.release(); // 풀에서 연결 반환
    }
}

module.exports = {
    registerUser,
    loginUser,
    checkEMAIL,
    checkNICK
};