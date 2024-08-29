function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}
// Chart.js로 게이지 그래프 그리기
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myGaugeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [20, 80], // 여기에 실제 데이터 값을 넣으세요.
                backgroundColor: ['#4caf50', 'red'],
                borderWidth: 0
            }]
        },
        options: {
            rotation: -Math.PI * 28.75,
            circumference: Math.PI * 57.5,
            cutout: '50%',
            plugins: {
                tooltip: { enabled: false }
            }
        }
    });
});


$(document).ready(function () {
    $('#info_re').on('click', function (event) {
        const user = document.body.getAttribute('data-user.PW');
        console.log(user);
        $('#info_rr').submit(); // 폼을 제출
    });

    $('#info_rr').submit(function (event) {
        const currentPw = document.getElementById('password').value;
        const newPw = document.getElementById('register_pw').value;
        console.log(currentPw);
        console.log(newPw);
        
        // event.preventDefault(); // 폼의 기본 제출 동작을 막음
        // const formData = $(this).serialize();
        // if (currentPw === newPw) {
        //     console.log("이전 비번과 같습니다");
        // } else {
        //     $.ajax({
        //         type: 'POST',
        //         url: '/mypage/info_r',
        //         data: formData,
        //         success: function (response) {
        //             console.log("로그인성공", response);
        //             window.location.href = '/';
        //         },
        //         error: function (xhr, status, error) {
        //             console.log("로그인실패", xhr.responseText);
        //         }
        //     });
        // }


    });
});

$(document).ready(function () {
    $('#del_id').on('click', function (event) {
        $('#id_del').submit(); // 폼을 제출
    });

    $('#id_del').submit(function (event) {
        
        
        const currentPw = document.getElementById('password2').value;
        const newPw = document.getElementById('del-password').value;
        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();
        if (currentPw === newPw) {
            $.ajax({
                type: 'POST',
                url: '/mypage/del_id',
                data: formData,
                success: function (response) {
                    console.log("삭제성공", response);
                },
                error: function (xhr, status, error) {
                    console.log("삭제실패", xhr.responseText);
                }
            });
        }
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.json({ message: 'Logged out successfully' });
        });
    });
});