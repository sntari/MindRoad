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
        const query = 'SELECT * FROM MEMBERS WHERE EMAIL = ? AND PW = ?';
        const [rows] = await connection.promise().query(query, [mem_id, mem_pw]);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.end();
    }
}

module.exports = {
    registerUser,
    loginUser,
};