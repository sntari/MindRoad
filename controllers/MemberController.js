const memberService = require('../services/MemberService');

// 회원가입 기능
async function register(req, res) {
    const { mem_id, mem_pw, mem_nick } = req.body;
    try {
        const user = await memberService.registerUser(mem_id, mem_pw, mem_nick);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error);  // 서버 측 콘솔에 오류 출력
        res.status(500).send({ success: false, message: error.message });
    }
}


// 로그인 기능
async function login(req, res) {
    const { mem_id, mem_pw } = req.body;
    const user = await memberService.loginUser(mem_id, mem_pw);
    if (user.length > 0) {
        req.session.user = user[0];
        res.status(200).send({ success: true });
    } else {
        res.status(401).send('Invalid email or password');
    }
}


// EMAIL 체크
async function checkE(req, res) {
    const { EMAIL } = req.body;
    try {
        const userEMAIL = await memberService.checkEMAIL(EMAIL);
        if (userEMAIL) {
            res.send("not available");
        } else {
            res.send("available");
        }
    } catch (error) {
        console.error("Error in checkE function:", error);
        res.status(500).send("Internal Server Error");
    }
}

// NICKNAME 체크
async function checkN(req, res) {
    const { NICK } = req.body;
    try {
        const userNICK = await memberService.checkNICK(NICK);
        if (userNICK) {
            res.send("not available");
        } else {
            res.send("available");
        }
    } catch (error) {
        console.error("Error in checkE function:", error);
        res.status(500).send("Internal Server Error");
    }
}



// 로그아웃 기능
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('세션 제거');            
        }
        res.redirect('/');
        console.log("로그아웃 성공");
    });
}



module.exports = {
    register,
    login,
    logout,
    checkE,
    checkN,
};