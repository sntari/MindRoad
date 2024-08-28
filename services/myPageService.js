const mysql = require('../config/mysql'); // mysql.js 파일을 불러옴

async function updateMemberInfo(nickname, newMemId, newMemPw) {
    // 데이터베이스 연결 설정
    const connection = await mysql.getConnection(); // 데이터베이스 풀에서 연결 가져오기
    try {
        // mem_id와 mem_pw를 업데이트하는 SQL 쿼리
        const [result] = await connection.execute(
            'UPDATE MEMBERS SET NICKNAME = ?, mem_pw = ? WHERE mem_id = ?',
            [nickname, newMemPw, newMemId]
        );
        
        // 업데이트된 행 수를 확인
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Database update error:", error);  // 로그에 상세 오류 출력
        throw error;  // 오류를 다시 던져서 상위 함수에서 처리하도록 함
    } finally {
        connection.release(); // 풀에서 연결 반환
    }
}

module.exports = {
    updateMemberInfo
};