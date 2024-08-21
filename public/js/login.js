// 백그라운드 및 로그인폼 지정
const modal = document.querySelector(".background");
const re = document.querySelector(".login__register");
const cr = document.querySelector(".login__create");

// 회원가입/ 로그인폼 아이디 선택자로 지정
const signup = document.getElementById("sign-up");
signin = document.getElementById("sign-in");
loginin = document.getElementById("login-in");
loginup = document.getElementById("login-up");

// background show 클래스 추가
function show() {
    modal.classList.add("show");
}

// background show 클래스 제거
function remove() {
    modal.classList.remove("show");
}

// 클릭 시 로그인 창을 보여줌
document.querySelector("#show").addEventListener("click", show);

// 모달창 외부 클릭 시 닫히게 하는 코드
modal.addEventListener("click", (event) => {
    // 클릭된 요소가 modalContent가 아니라면 모달을 닫고/ 로그인폼으로 지정
    if (!re.contains(event.target) && !cr.contains(event.target)) {
        remove();
        loginin.classList.remove("none");
        loginup.classList.remove("block");

        loginin.classList.add("block");
        loginup.classList.add("none");
    }
});

// 로그인창 / 회원가입 창 클래스 속성 추가/제거
signup.addEventListener("click", () => {
    loginin.classList.remove("block");
    loginup.classList.remove("none");

    loginin.classList.add("none");
    loginup.classList.add("block");
})

signin.addEventListener("click", () => {
    loginin.classList.remove("none");
    loginup.classList.remove("block");

    loginin.classList.add("block");
    loginup.classList.add("none");
})