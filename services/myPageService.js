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

// 마이페이지 로그인 테스트
async function loginUser(mem_id, new_pw) {
    const connection = await mysql.connect();
    try {
        if (mem_id != "") {
            const query = 'SELECT * FROM MEMBERS WHERE EMAIL = ? AND PW = ?';
            const [rows] = await connection.promise().query(query, [mem_id, new_pw]);
            return rows;
        } else {
            return 0;
        }
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}

// 파이차트 긍부중
async function mypage_AVG(user) {
    let connection;
    try {
        // 데이터베이스 연결
        connection = await mysql.getConnection();

        // SELECT 쿼리 정의
        const query = `
            SELECT
            GOOD AS recent_good,
            BAD AS recent_bad,
            CENTER AS recent_center,
            QUESTIONS AS my_Q
            FROM SCORE_DATA
            WHERE nickname = ? AND id = (
            SELECT MAX(id)
            FROM SCORE_DATA
            WHERE nickname = ?
            )
        `;

        // 쿼리 실행
        const [rows] = await connection.execute(query, [user, user]);

        // 결과 반환
        if (rows.length > 0) {
            return {
                average_good: rows[0].recent_good,
                average_bad: rows[0].recent_bad,
                average_center: rows[0].recent_center,
                my_Q: rows[0].my_Q,
            };
        } else {
            return { average_good: 33, average_bad: 33, average_center: 34 };
        }
    } catch (error) {
        console.error('Error retrieving chatbot sentiment averages:', error);
        throw error;
    } finally {
        // 연결 종료
        if (connection) {
            connection.release();
        }
    }
}

// 부정 평균 수치
async function mypage_BAD(user) {
    let connection;
    try {
        // 데이터베이스 연결
        connection = await mysql.getConnection();

        // SELECT 쿼리 정의
        const query = `
            SELECT BAD AS avg_bad
            FROM SCORE_DATA
            WHERE nickname = ?
            ORDER BY id DESC
            LIMIT 10;
        `;

        // SELECT 쿼리 정의
        const query2 = `
            SELECT
            AVG(BAD) AS all_bad
            FROM SCORE_DATA
        `;

        // 쿼리 실행
        const [rows] = await connection.execute(query, [user]); // 사용자 부정수치
        const [rows2] = await connection.execute(query2);   // 부정수치 전체평균
        const rows3 = rows.map(item => item.avg_bad);   // 리스트로 변환
        
        // 결과 반환
        if (rows.length > 0) {
            return {
                avg_bad: rows3,
                all_bad: rows2[0].all_bad
            };
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error retrieving chatbot sentiment averages:', error);
        throw error;
    } finally {
        // 연결 종료
        if (connection) {
            connection.release();
        }
    }
}

// 그래프 부정
async function graph_BAD(user) {
    let connection;
    try {
        // 데이터베이스 연결
        connection = await mysql.getConnection();

        // SELECT 쿼리 정의
        const query = `
            SELECT
            BAD AS g_bad
            FROM SCORE_DATA
            WHERE nickname = ? AND id = (
            SELECT MAX(id)
            FROM SCORE_DATA
            WHERE nickname = ?
            )
        `;

        // 쿼리 실행
        const [rows] = await connection.execute(query, [user, user]);

        // 결과 반환
        if (rows.length > 0) {
            return {
                g_bad: rows[0].g_bad
            };
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error retrieving chatbot sentiment averages:', error);
        throw error;
    } finally {
        // 연결 종료
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    updateMemberInfo,
    del_member,
    loginUser,
    mypage_AVG,
    mypage_BAD,
    graph_BAD
};