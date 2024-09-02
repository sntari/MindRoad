function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// 게이지 그래프
document.addEventListener('DOMContentLoaded', gaugeGraphUpdate);
gaugeGraphUpdate();
function gaugeGraphUpdate() {
    var opts = {
        angle: 0.0, // 게이지의 스팬 (각도)
        lineWidth: 0.2, // 게이지의 선 두께
        radiusScale: 0.5, // 상대적인 반지름 크기
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
}

// 파이 그래프
const pieData = {
    labels: [
        '긍정', '부정', '중립'
    ],
    datasets: [{
        label: '감정 분포도',
        data: [0.1, 0.2, 0.7], // 데이터 값 예시
        backgroundColor: [
            'rgb(54, 162, 235)',  // 긍정
            'rgb(255, 205, 86)',  // 부정
            'rgb(75, 192, 192)',  // 중립
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
                display: true
            }
        }
    }
});

// 꺾은 선 그래프
const labels = ["최초 상담일", "2회차", "3회차", "4회차", "5회차", "최근"]; // 레이블 및 데이터 값 input 값으로 수정
const data = {
    labels: labels,
    datasets: [{
        label: '상담 기록에 따른 우울도 추이',
        font: {
            size:24
        },
        data: [65, 59, 70, 31, 45, 15], // 꺾은 선 그래프의 데이터 값
        fill: false,
        borderColor: 'rgb(75, 140, 192)',
        tension: 0.4
    }]
};
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
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 24
                    }
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
});

// 고민 카테고리
document.addEventListener('DOMContentLoaded', function() {
    var worryCategory = "일반고민"; // 추후 해당 값을 모델에서 입력받음

    // 분석 결과에 따라 worry-text 요소의 내용을 설정
    var worryTextElement = document.getElementById('worry-text');
    worryTextElement.textContent = worryCategory;
});

function depressionScore() {
    let totalScore = 0;
    
    // 각 문항에 대해 선택된 값을 합산
    for (let i = 1; i <= 9; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedOption) {
            totalScore += parseInt(selectedOption.value, 10);
        }
    }
    // 합계 점수 표시
    document.getElementById('total-score').textContent = totalScore;

    // 점수에 따른 결과 텍스트
    let resultText = '';
    if (totalScore <= 4) {
        resultText = '정상';
    } else if (totalScore <= 9) {
        resultText = '경미한 수준의 우울함';
    } else if (totalScore <= 14) {
        resultText = '중간 수준의 우울함';
    } else if (totalScore <= 19) {
        resultText = '약간 심한 수준의 우울함';
    } else if (totalScore <= 27) {
        resultText = '심한 수준의 우울함';
    }
    // 결과 텍스트 표시
    document.getElementById('result-text').textContent = resultText;
}


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
                document.getElementById('mypage_error1').innerHTML = "";
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
                document.getElementById('mypage_error1').innerHTML = "이전 비밀번호와 같습니다";
            }
        } else {
            document.getElementById('mypage_error1').innerHTML = "현재 비밀번호가 일치하지 않습니다";
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

        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const formData = $(this).serialize();
        if (currentPw == newPw && newPw == Pw) {
            $.ajax({
                type: 'POST',
                url: '/mypage/del_id',
                data: formData,
                success: function (response) {
                    // 로그아웃
                    $.ajax({
                        type: 'GET',
                        url: '/mypage/logout',
                        success: function (response) {
                            window.location.href = '/';
                        },
                        error: function (xhr, status, error) {
                            console.log("로그아웃실패", xhr.responseText);
                        }
                    });
                },
                error: function (xhr, status, error) {
                    console.log("삭제실패", xhr.responseText);
                }
            });
        } else {
            document.getElementById('mypage_error2').innerHTML = "비밀번호가 일치하지 않습니다";
        }


    });
});
