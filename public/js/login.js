// 백그라운드 및 로그인폼 지정
const modal = document.querySelector(".background");
const re = document.querySelector(".login__register");
const cr = document.querySelector(".login__create");

// 회원가입/ 로그인폼 아이디 선택자로 지정
const signup = document.getElementById("sign-up");
const signin = document.getElementById("sign-in");
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


    document.getElementById('mem_id').value = '';	 // 로그인 input 값 초기화
    document.getElementById('mem_pw').value = ''; // 로그인 input 값 초기화
})

signin.addEventListener("click", () => {
    loginin.classList.remove("none");
    loginup.classList.remove("block");

    loginin.classList.add("block");
    loginup.classList.add("none");
    document.getElementById('register_id').value = '';	 // 회원가입 input 값 초기화
    document.getElementById('register_nick').value = ''; // 회원가입 input 값 초기화
    document.getElementById('register_pw').value = '';   // 회원가입 input 값 초기화
    document.getElementById("pw_len").style.display = 'none'; 					 // 비밀번호 보안강도 초기화
    document.querySelectorAll('.login__box')[4].style.padding = '1.125rem 1rem'; // 비밀번호 보안강도 초기화
    document.getElementById("sample").innerText = ""; 							 // 비밀번호 보안강도 초기화
    document.getElementById("register_nick_text").innerText = "";				// 중복감지후 텍스트 삭제시 중복감지 알람 사라지게
    document.getElementById("register_id_text").innerText = "";				// 중복감지후 텍스트 삭제시 중복감지 알람 사라지게
    strengthBar.value = 0;
})

// EMAIL 중복체크
let checkEmail = 0;
$(document).ready(function () {
    $('#register_id').blur(function () {
        const memIdValue = $(this).val();
        document.getElementById("register_id_text").innerText = "";				// 중복감지후 텍스트 삭제시 중복감지 알람 사라지게
        console.log("AJAX request value:", memIdValue);
        if (!memIdValue) {
            return;
        }
        $.ajax({
            url: "/member/checkE",
            type: "POST",
            data: {  // 전달할 데이터
                EMAIL: memIdValue
            },
            success: function (response) {
                console.log("Server response:", response);
                if (response === "available") {
                    document.getElementById("register_id_text").innerText = "";
                    checkEmail = 1;
                } else {
                    document.getElementById("register_id_text").innerText = "이미 사용중인 이메일입니다.";
                    console.log("실패");
                    checkEmail = 0;
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX 오류 발생:", status, error);
            }
        });
    });
});
// NICKNAME 중복체크
let checkNickname = 0;
$(document).ready(function () {
    $('#register_nick').blur(function () {
        const NickValue = $(this).val();
        document.getElementById("register_nick_text").innerText = "";				// 중복감지후 텍스트 삭제시 중복감지 알람 사라지게
        console.log("AJAX request value:", NickValue);
        if (!NickValue) {
            return;
        }
        $.ajax({
            url: "/member/checkN",
            type: "POST",
            data: {  // 전달할 데이터
                NICK: NickValue
            },
            success: function (response) {
                console.log("Server response:", response);
                if (response === "available") {
                    document.getElementById("register_nick_text").innerText = "";
                    checkNickname = 1;
                } else {
                    document.getElementById("register_nick_text").innerText = "이미 사용중인 닉네임입니다.";
                    checkNickname = 0;
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX 오류 발생:", status, error);
            }
        });
    });
});


// 회원가입

$(document).ready(function () {
    $('#r-link').on('click', function (event) {
        event.preventDefault(); // 기본 a태그 동작(링크 이동)을 막음
        $('#login-up').submit(); // 폼을 제출
    });

    $('#login-up').submit(function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();

        if (password.value.length >= 7 && checkNickname == 1 && checkEmail == 1) {
            $.ajax({
                type: 'POST',
                url: '/member/register',
                data: formData,
                success: function (response) {
                    console.log("회원가입성공", response);
                    loginin.classList.remove("none");		//로그인화면으로 넘어가기
                    loginup.classList.remove("block");		//로그인화면으로 넘어가기
                    loginin.classList.add("block");			//로그인화면으로 넘어가기
                    loginup.classList.add("none");			//로그인화면으로 넘어가기
                    document.getElementById('register_id').value = '';	 // 회원가입 input 값 초기화
                    document.getElementById('register_nick').value = ''; // 회원가입 input 값 초기화
                    document.getElementById('register_pw').value = '';   // 회원가입 input 값 초기화
                    document.getElementById("pw_len").style.display = 'none'; 					 // 비밀번호 보안강도 초기화
                    document.querySelectorAll('.login__box')[4].style.padding = '1.125rem 1rem'; // 비밀번호 보안강도 초기화
                    document.getElementById("sample").innerText = ""; 							 // 비밀번호 보안강도 초기화
                },
                error: function (xhr, status, error) {
                    console.log("회원가입실패", xhr.responseText);
                }
            });
        }
    });
});


// 로그인
$(document).ready(function () {
    $('#l-link').on('click', function (event) {
        event.preventDefault(); // 기본 a태그 동작(링크 이동)을 막음
        $('#login-in').submit(); // 폼을 제출
    });

    $('#login-in').submit(function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/member/login',
            data: formData,
            success: function (response) {
                console.log("로그인성공", response);
                window.location.href = '/';
            },
            error: function (xhr, status, error) {
                console.log("로그인실패", xhr.responseText);
                document.getElementById("login_check").style.display = 'block';
            }
        });
    });
});

// 비밀번호 강도
let strength = 0;
const password = document.querySelector("#register_pw")
const strengthBar = document.querySelector("#meter")
var display = document.querySelector(".textbox")
password.addEventListener("keyup", function () {
    checkPassword(password.value);
});
function checkPassword(password) {
    strength = 0;
    const regexes = [
        /[a-z]+/,
        /[A-Z]+/,
        /[0-9]+/,
        /[$@#&!]+/,
    ]

    regexes.forEach((regex, index) => {
        strength += password.match(regex) ? 1 : 0
    })

    strengthBar.value = strength

    switch (strength) {
        case 1:
            strengthBar.style.setProperty("--c", "red")
            document.getElementById("sample").innerText = "취약";
            break
        case 2:
            strengthBar.style.setProperty("--c", "orange")
            document.getElementById("sample").innerText = "약함";
            break
        case 3:
            strengthBar.style.setProperty("--c", "yellowgreen")
            document.getElementById("sample").innerText = "중간";
            break
        case 4:
            strengthBar.style.setProperty("--c", "green")
            document.getElementById("sample").innerText = "강함";
            break
        case 0:
            document.getElementById("sample").innerText = "";
    }
}
$(document).ready(function () {
    $('#register_pw').on('input', function () {
        console.log(password.value.length);

        if (password.value.length == 0 || password.value.length >= 7) {
            document.getElementById("pw_len").style.display = 'none'; // 문자열 길이가 7 이상이면 경고 메시지를 숨김
            document.querySelectorAll('.login__box')[4].style.padding = '1.125rem 1rem';
        } if (0 < password.value.length && password.value.length <= 6) {
            document.getElementById("pw_len").style.display = 'block'; // 문자열 길이가 6 이하일 때 경고 메시지를 표시
            document.querySelectorAll('.login__box')[4].style.padding = '0.6rem 1rem';
        }
    });
});