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
    
    try {
        // 계정 삭제 작업 수행
        await myPageService.del_member(mem_id, mem_pw, new_pw);
        
        // 계정 삭제 후 현재 세션 종료
        req.session.destroy(err => {
            if (err) {
                console.error('Session destruction error:', err); // 세션 종료 오류 출력
                return res.status(500).send({ success: false, message: 'Failed to end session' });
            }
            
            // 세션 쿠키 삭제 (선택 사항, 세션 쿠키가 설정되어 있는 경우)
            res.clearCookie('connect.sid'); 
            
            // 성공적인 응답 전송
            res.status(200).send({ success: true, message: 'Account deleted and logged out successfully' });
        });
    } catch (error) {
        console.error('Account deletion error:', error); // 계정 삭제 오류 출력
        res.status(500).send({ success: false, message: error.message });
    }
}




module.exports = {
    info_r,
    del_id,
    
};
