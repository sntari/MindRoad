const myPageService = require('../services/myPageService');

// 회원정보 업데이트
async function info_r(req, res) {
    const { mem_id, mem_nick, mem_pw, new_pw } = req.body;
    await myPageService.updateMemberInfo(mem_id, mem_nick, mem_pw, new_pw);
    const user = await myPageService.loginUser(mem_id, new_pw);
    if (user.length > 0) {
        req.session.user = user[0];
        res.status(200).send({ success: true });
    } else {
        res.status(401).send('Invalid email or password');
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

// 로그아웃
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('세션 제거');
        }
        res.redirect('/');
    });
}

// 긍부중 평균
async function pie_info(req, res){
    try {
        const { nickname } = req.body;
        
        // nickname을 기반으로 pie 값을 계산
        const pie = await myPageService.mypage_AVG(nickname);

        // 응답을 JSON 형식으로 보내기
        res.json({
            success: true,
            pie: pie,
            message: pie > 0 ? 'User session updated' : 'Pie value is not greater than 0'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// 그래프 부정
async function graph_info(req, res){
    try {
        const { nickname } = req.body;
        
        // nickname을 기반으로 pie 값을 계산
        const pie2 = await myPageService.graph_BAD(nickname);
        
        // 응답을 JSON 형식으로 보내기
        res.json({
            success: true,
            pie2: pie2,
            message: pie2 > 0 ? 'User session updated' : 'Pie value is not greater than 0'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// 꺾은선 그래프
async function Graph_BAD(req, res){
    try {
        const { nickname } = req.body;
        
        // nickname을 기반으로 pie 값을 계산
        const graph = await myPageService.mypage_BAD(nickname);
        // 응답을 JSON 형식으로 보내기
        res.json({
            success: true,
            graph: graph,
            message: graph > 0 ? 'User session updated' : 'Pie value is not greater than 0'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = {
    info_r,
    del_id,
    logout,
    pie_info,
    Graph_BAD,
    graph_info,
};
