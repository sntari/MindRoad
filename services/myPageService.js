const mysql = require('../config/mysql'); // mysql.js 파일을 불러옴


// 계정정보변경
async function updateMemberInfo(mem_id, mem_nick, mem_pw, new_pw) {
    // 데이터베이스 연결 설정
    const connection = await mysql.getConnection(); // 데이터베이스 풀에서 연결 가져오기
    try {
        // mem_id와 mem_pw를 업데이트하는 SQL 쿼리
        const [result] = await connection.execute(
            'UPDATE MEMBERS SET NICKNAME = ?, PW = ? WHERE EMAIL = ? AND PW = ?',
            [mem_nick, new_pw, mem_id, mem_pw]
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

// 계정 삭제
async function del_member(mem_id, mem_pw, new_pw) {
    // 데이터베이스 연결 설정
    const connection = await mysql.getConnection(); // 데이터베이스 풀에서 연결 가져오기
    try {
        // mem_id와 mem_pw를 업데이트하는 SQL 쿼리
        const [result] = await connection.execute(
            'DELETE FROM MEMBERS WHERE EMAIL = ? AND PW = ?',
            [mem_id, mem_pw]
        );
        // 업데이트된 행 수를 확인
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Database update error:", error);  // 로그에 상세 오류 출력
        return 1;
    } finally {
        connection.release(); // 풀에서 연결 반환
    }
}



module.exports = {
    updateMemberInfo,
    del_member,
    
};