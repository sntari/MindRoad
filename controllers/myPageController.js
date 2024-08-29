const myPageService = require('../services/myPageService');

// 회원정보 업데이트
async function info_r(req, res) {
    const { mem_id, mem_nick, mem_pw, new_pw } = req.body;

    try {
        const userupdate = await myPageService.updateMemberInfo(mem_id, mem_nick, mem_pw, new_pw);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error);  // 서버 측 콘솔에 오류 출력
        res.status(500).send({ success: false, message: error.message });

        console.log(mem_id);
        console.log(mem_nick);
        console.log(mem_pw);
        console.log(new_pw);
    }
}


module.exports = {
    info_r
};
