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
        data: [60, 30, 10], // 데이터 값
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
        $('#info_rr').submit(); // 폼을 제출
    });

    $('#info_rr').submit(function (event) {
        const currentPw = document.getElementById('password').value;
        const newPw = document.getElementById('register_pw2').value;
        const Pw = document.getElementById('pw_check').innerHTML;



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
                data: formData,
                success: function (response) {
                    console.log("삭제성공", response);
                    // 로그아웃
                    $.ajax({
                        type: 'GET',
                        url: '/mypage/logout',
                        success: function (response) {
                            window.location.href = '/';
                        },
                        error: function (xhr, status, error) {
                            console.log("삭제실패", xhr.responseText);
                        }
                    });
                },
                error: function (xhr, status, error) {
                    console.log("삭제실패", xhr.responseText);
                }
            });
        } else {
            console.log("비번 틀림");

        }


    });
});

document.addEventListener('DOMContentLoaded', function () {
    var opts = {
        angle: 0.0, // 게이지의 스팬 (각도)
        lineWidth: 0.2, // 게이지의 선 두께
        radiusScale: 0.57, // 상대적인 반지름 크기
        pointer: {
            length: 0.6, // 화살표의 길이 (게이지 반지름에 대한 비율)
            strokeWidth: 0.035, // 화살표의 두께
            color: '#000000' // 화살표 색상
        },
        limitMax: false, // 최대값 제한 사용 여부
        limitMin: false, // 최소값 제한 사용 여부
        colorStart: 'orange', // 게이지의 시작 색상
        colorStop: 'red', // 게이지의 끝 색상
        strokeColor: 'green', // 게이지의 테두리 색상
        generateGradient: true, // 색상 그라데이션 생성 여부
        highDpiSupport: true, // 고해상도 지원 여부
        // 구간별 색상 적용
        staticZones: [
            {strokeStyle: "green", min: 0, max: 20 }, // 구간 0-20: 녹색
            {strokeStyle: "lime", min: 21, max: 40 }, // 구간 21-40: 라임색
            {strokeStyle: "yellow", min: 41, max: 60 }, // 구간 41-60: 노란색
            {strokeStyle: "orange", min: 61, max: 80 }, // 구간 61-80: 주황색
            {strokeStyle: "red", min: 81, max: 100 } // 구간 81-100: 빨간색
        ],
    };

    var target = document.getElementById('gauge'); // canvas 요소 선택
    var gauge = new Gauge(target).setOptions(opts); // Gauge 객체 생성 및 옵션 설정
    gauge.maxValue = 100; // 최대값 설정
    gauge.setMinValue(0); // 최소값 설정
    gauge.animationSpeed = 32; // 애니메이션 속도 설정

    var currentValue = 71; // 현재 값 설정
    gauge.set(currentValue); // 현재 값 적용

    // 현재 값을 텍스트로 표시
    function updateGaugeText(value) {
        var gaugeText = document.getElementById('gauge-text');
        gaugeText.textContent = value;
    }

    updateGaugeText(currentValue); // 현재 값 텍스트 업데이트
});