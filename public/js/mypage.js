function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

window.onload = function() {
    const ctx = document.getElementById('myGaugeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [20, 80], // 여기에 실제 데이터 값을 넣으세요.
                backgroundColor: ['red', '#4caf50'],
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
        },
        events: [],
        animation: {
            animateRotate: false,
            animateScale: false
        }
    });
};

// 게이지 그래프
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myGaugeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [40, 60], // 여기에 실제 데이터 값을 넣으세요.
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
        },
        // 화살표 그리기
        events: [],
        animation: {
            animateRotate: false,
            animateScale: false
        }
    });
});

// 꺾은 선 그래프
const labels = ["최초 상담일", "2회차", "3회차", "4회차", "5회차", "최근"]; // 레이블 및 데이터 값 input 값으로 수정
const data = {
    labels: labels,
    datasets: [{
        label: '상담 기록에 따른 우울도 추이',
        data: [65, 59, 70, 31, 45, 15], // 꺾은 선 그래프의 데이터 값
        fill: false,
        borderColor: 'rgb(75, 140, 192)',
        tension: 0.4
    }]
};

// Line Chart 생성
const ctx = document.getElementById('myLineChart').getContext('2d');
const myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: '꺾은 선 그래프 예시'
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// 파이 그래프
const pieData = {
    labels: ['Red', 'Blue', 'Yellow'], // 레이블 추후 수정
    datasets: [{
        label: '파이 그래프 예시',
        data: [300, 50, 100], // 데이터 값
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};
const pieCtx = document.getElementById('myPieChart').getContext('2d');
const myPieChart = new Chart(pieCtx, {
    type: 'pie',
    data: pieData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '파이 그래프'
            }
        }
    }
});

// 계정 정보 수정
$(document).ready(function () {
    $('#info_re').on('click', function (event) {
        const user = document.body.getAttribute('data-user.PW');
        console.log(user);
        $('#info_rr').submit(); // 폼을 제출
    });

    $('#info_rr').submit(function (event) {
        const currentPw = document.getElementById('password').value;
        const newPw = document.getElementById('register_pw').value;
        const Pw = document.getElementById('pw_check').value;


        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();
        console.log(Pw);
        console.log(currentPw);
        console.log(newPw);


        if (Pw === currentPw) {
            console.log("비번은 맞아요");
            if (Pw != newPw) {
                console.log("이전비번과 달라요");
                $.ajax({
                    type: 'POST',
                    url: '/mypage/info_r',
                    data: formData,
                    success: function (response) {
                        console.log("로그인성공", response);
                        window.location.href = '/';
                    },
                    error: function (xhr, status, error) {
                        console.log("로그인실패", xhr.responseText);
                    }
                });
            } else {
                console.log("이전비번과 같아요");
            }
        } else {
            console.log("비번이 틀렸어");

        }


    });
});


// 계정 삭제
$(document).ready(function () {
    $('#del_id').on('click', function (event) {
        $('#id_del').submit(); // 폼을 제출
    });

    $('#id_del').submit(function (event) {
        const currentPw = document.getElementById('password2').value;
        const newPw = document.getElementById('del-password').value;
        const Pw = document.getElementById('pw_check').innerHTML;
        console.log(currentPw);
        console.log(newPw);
        console.log(Pw);

        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();
        if (currentPw == newPw && newPw == Pw) {
            $.ajax({
                type: 'POST',
                url: '/mypage/del_id',
                url: '/mypage/del_id',
                data: formData,
                success: function (response) {
                    console.log("삭제성공", response);
                    console.log("삭제성공", response);
                    window.location.href = '/';
                },
                error: function (xhr, status, error) {
                    console.log("삭제실패", xhr.responseText);
                    console.log("삭제실패", xhr.responseText);
                }
            });
        } else {
            console.log("비번 틀림");

        }


    });
});