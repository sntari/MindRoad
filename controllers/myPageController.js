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
    }
}

// 계정 삭제 및 로그아웃 기능을 포함한 async 함수
async function del_id(req, res) {
    const { mem_id, mem_pw, new_pw } = req.body;
    const ddd = await myPageService.del_member(mem_id, mem_pw, new_pw);
    if (ddd > 0) {
        res.status(200).send({ success: true });
        
    } else {
        res.status(500).send({ success: false });
    }
}




module.exports = {
    info_r,
    del_id,

};
