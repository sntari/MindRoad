const myPageService = require('../services/myPageService');

// 회원정보 업데이트
async function info_r(req, res) {
    const { mem_nick, mem_id, mem_pw } = req.body;
    try {
        const user = await myPageService.registerUser(mem_nick, mem_id, mem_pw);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error);  // 서버 측 콘솔에 오류 출력
        res.status(500).send({ success: false, message: error.message });
    }
}


module.exports = {
    info_r
};
