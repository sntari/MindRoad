function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}
function calculateAverage(avg_bad) {
    if (avg_bad.length === 0) return 0; // 배열이 비어 있을 때 0 반환

    let sum = avg_bad.reduce((acc, num) => acc + num, 0);
    return sum / avg_bad.length;
}

// 파이 그래프
let good = 1;
let bad = 1;
let center = 1;

$(document).ready(function () {
    const nickname = document.getElementById('nickname').value;

    // 첫 번째 AJAX 요청 (파이 차트 및 게이지)
    $.ajax({
        type: 'POST',
        url: '/mypage/pie_info',
        data: { nickname: nickname },
        success: function (response) {
            good = parseFloat(response.pie.average_good);
            bad = parseFloat(response.pie.average_bad);
            center = parseFloat(response.pie.average_center);
            my_Q = response.pie.my_Q;

            document.getElementById('worry-text').innerText = my_Q;
            // 파이차트
            const pieData = {
                labels: ['긍정', '부정', '중립'],
                datasets: [{
                    label: '감정 분포도',
                    data: [good, bad, center],
                    backgroundColor: [
                        'rgb(54, 162, 235)',  // 파랑 (긍정)
                        'rgb(255, 80, 80)',  // 빨강 (부정)
                        'rgb(255, 206, 86)'   // 노랑 (중립)
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
                            labels: {
                                font: {
                                    size: 18  // 상단 레이블의 텍스트 크기 조정
                                }
                            }
                        },
                        title: { display: true },
                        datalabels: {
                            formatter: (value, context) => {
                                return value.toFixed(1) + "%";
                            },
                            color: '#000000',  // 라벨의 텍스트 색상
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]  // datalabels 플러그인 활성화
            });

        },
        error: function (xhr, status, error) {
            console.log("긍부중실패", xhr.responseText);
        }
    });

    // 두 번째 AJAX 요청 (우울도 꺾은선 그래프)
    $.ajax({
        type: 'POST',
        url: '/mypage/Graph_BAD',
        data: { nickname: nickname },
        success: function (response) {
            const avg_bad = response.graph.avg_bad;
            const all_bad = parseFloat(response.graph.all_bad);

            // 꺾은 선 그래프
            const label_int = avg_bad;
            const label_int_Length = label_int.length;
            const labels = Array.from({ length: label_int_Length }, (_, index) => `${index + 1}회차`);
            const all_bad_list = Array.from({ length: label_int_Length }, () => all_bad);
            const avg_list = avg_bad.length === 0 ? 0 : avg_bad.reduce((acc, num) => acc + num, 0) / avg_bad.length;
            const all_avg_list = Array.from({ length: label_int_Length }, () => avg_list);



            const data = {
                labels: labels,
                datasets: [
                    {
                        label: '상담 기록에 따른 부정도 추이',
                        data: avg_bad.reverse(),
                        fill: false,
                        borderColor: 'rgb(75, 140, 192)',
                        tension: 0.4
                    },
                    {
                        label: '전체 부정도 평균',
                        data: all_bad_list,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.4
                    },
                    {
                        label: nickname + '님 부정치 평균',
                        data: all_avg_list,
                        fill: false,
                        borderColor: '#43A047',
                        tension: 0.4
                    }
                ]
            };

            const ctx = document.getElementById('myLineChart').getContext('2d');
            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    maintainAspectRatio: true, // 비율 유지하지 않음
                    layout: {
                        padding: {
                            left: 50,   // 왼쪽 여백
                            right: 50,  // 오른쪽 여백
                            top: 20,    // 위쪽 여백
                            bottom: 20  // 아래쪽 여백
                        }
                    },
                    responsive: true,
                    plugins: {
                        title: {
                            display: true, text: nickname + '님의 감정평균, 전체 평균', font: {
                                size: 30
                            },
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                generateLabels: function (chart) {
                                    const datasets = chart.data.datasets;
                                    return datasets.map((dataset, i) => ({
                                        text: dataset.label,
                                        datasetIndex: i,
                                        fillStyle: dataset.borderColor,
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: 0.01
                                    }));
                                },
                                usePointStyle: false
                            }
                        },
                        datalabels: {
                            display: true,         // 라벨을 표시
                            color: 'black',        // 라벨의 색상
                            align: 'right',          // 데이터 포인트 위에 라벨 배치
                            font: {                // 폰트 설정
                                size: 20,          // 폰트 크기 (예: 14px)
                                weight: 'bold'     // 폰트 굵기 (옵션)
                            },
                            formatter: (value, context) => {
                                // 전체 부정도 평균과 nickname 부정치 평균에서 마지막 데이터만 표시
                                const dataset = context.dataset;
                                const dataIndex = context.dataIndex;
                                const lastIndex = dataset.data.length - 1;

                                if (dataset.label === '전체 부정도 평균' || dataset.label === nickname + '님 부정치 평균') {
                                    if (dataIndex === lastIndex) {
                                        return value.toFixed(1); // 마지막 데이터 포인트에 소수점 한자리로 라벨 표시
                                    }
                                }
                                return null; // 그 외에는 라벨을 표시하지 않음
                            }
                        }
                    },
                    scales: {
                        x: { beginAtZero: true },
                        y: {
                            beginAtZero: true,
                            min: 0,
                            max: 100
                        }
                    }
                },
                plugins: [ChartDataLabels] // 플러그인 추가
            });


        },
        error: function (xhr, status, error) {
            console.log("긍부중실패", xhr.responseText);
        }
    });
    $.ajax({
        type: 'POST',
        url: '/mypage/graph_info',
        data: { nickname: nickname },
        success: function (response) {
            const g_bad = response.pie2.g_bad;


            // 게이지 그래프 업데이트
            function gaugeGraphUpdate(bad) {
                var opts = {
                    angle: 0.0,
                    lineWidth: 0.2,
                    radiusScale: 0.5,
                    pointer: {
                        length: 0.6,
                        strokeWidth: 0.035,
                        color: '#000000'
                    },
                    limitMax: false,
                    limitMin: false,
                    colorStart: 'orange',
                    colorStop: 'red',
                    strokeColor: 'green',
                    generateGradient: true,
                    highDpiSupport: true,
                    staticZones: [
                        { strokeStyle: "#388E3C", min: 0, max: 20 }, // even darker green
                        { strokeStyle: "#43A047", min: 21, max: 40 }, // darker lime
                        { strokeStyle: "#FDD835", min: 41, max: 60 }, // darker yellow
                        { strokeStyle: "#FF5722", min: 61, max: 80 }, // darker salmon
                        { strokeStyle: "#D32F2F", min: 81, max: 100 } // darker coral
                    ]

                };

                var target = document.getElementById('gauge');

                if (!target) {
                    return;
                }

                var gauge = new Gauge(target).setOptions(opts);
                gauge.maxValue = 100;
                gauge.setMinValue(0);
                gauge.animationSpeed = 32;
           
            
                gauge.set(bad);  // bad 값을 게이지에 설정
                
                

                var gaugeText = document.getElementById('gauge-text');
                
                if (bad === 0) {
                    gaugeText.textContent = "현재 고민이 없습니다.";
                    
                }else{
                    gaugeText.textContent = "위험도 : " + Math.round(bad);  // 게이지 텍스트 업데이트
                    gaugeText.style.fontSize = 55;
                }
                

                if (bad < 20) {
                    gaugeText.style.color = "#388E3C";
                } else if (bad < 40) {
                    gaugeText.style.color = "#43A047";
                } else if (bad < 60) {
                    gaugeText.style.color = "#FDD835";
                } else if (bad < 80) {
                    gaugeText.style.color = "#FF5722";
                } else if (bad <= 100) {
                    gaugeText.style.color = "#D32F2F";
                }
            }
            setTimeout(() => {
                gaugeGraphUpdate(g_bad);
            }, 3000);
            document.querySelector('.mypage_tab').addEventListener('click', () => {
                gaugeGraphUpdate(g_bad);
            });

        },
        error: function (xhr, status, error) {
            console.log("긍부중실패", xhr.responseText);
        }
    });
});




// 고민 카테고리 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    var worryCategory = "일반고민"; // 추후 해당 값을 모델에서 입력받음

    // 분석 결과에 따라 worry-text 요소의 내용을 설정
    var worryTextElement = document.getElementById('worry-text');
    worryTextElement.textContent = worryCategory;
});

function calculateScore() {
    let totalScore = 0;
    let allAnswered = true; // 모든 항목이 선택되었는지 확인하는 변수

    // 각 문항에 대해 선택된 값을 합산
    for (let i = 1; i <= 9; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedOption) {
            totalScore += parseInt(selectedOption.value, 10);
        } else {
            allAnswered = false; // 하나라도 선택되지 않았을 경우 false로 변경
        }
    }

    // 오류 메시지를 위한 별도 변수
    const errorElement = document.getElementById('error-message');
    const resultElement = document.getElementById('survey_result');
    
    // 모든 항목이 선택되지 않았을 경우
    if (!allAnswered) {
        errorElement.textContent = '모든 항목을 선택해주세요.'; // 오류 메시지 출력
        resultElement.style.display = 'none'; // 결과는 숨김
        return; // 더 이상 진행하지 않음
    }

    // 항목이 모두 선택되었으면 오류 메시지 숨기기
    errorElement.textContent = '';

    // 합계 점수 표시
    document.getElementById('total-score').textContent = totalScore;

    let resultText = '';
    let commentText = '';
    let resultColor = 'black'; // 기본 색상

    if (totalScore <= 4) {
        resultText = '정상';
        commentText = '적응상의 지장을 초래할만한 우울 관련 증상을 거의 보이지 않았습니다.';
        resultColor = 'green';
    } else if (totalScore <= 9) {
        resultText = '경미한 수준의 우울함';
        commentText = '경미한 수준의 우울감이 있으나 일상생활에 지장을 줄 정도는 아닙니다.';
        resultColor = '#2ede02';
    } else if (totalScore <= 14) {
        resultText = '중간 수준의 우울함';
        commentText = '중간수준의 우울감을 비교적 자주 경험하는 것으로 보입니다.<br>직업적, 사회적 적응에 일부 영향을 미칠 수 있어 주의 깊은 관찰과 관심이 필요합니다.';
        resultColor = '#e38c02';
    } else if (totalScore <= 19) {
        resultText = '약간 심한 수준의 우울함';
        commentText = '약간 심한 수준의 우울감을 자주 경험하는 것으로 보입니다.<br>직업적, 사회적 적응에 일부 영향을 미칠 수 있습니다.<br>정신건강 전문가의 도움을 받아 보시기를 권해 드립니다.';
        resultColor = '#f75002';
    } else if (totalScore <= 27) {
        resultText = '심한 수준의 우울함';
        commentText = '광범위한 우울 증상을 매우 자주, 심한 수준에서 경험하는 것으로 보입니다.<br>일상생활의 다양한 영역에서 어려움이 초래될 경우.<br>추가적인 평가나 정신건강 전문가의 도움을 받아보시기를 권해 드립니다.';
        resultColor = '#f80101';
    }

    // 결과 텍스트 표시
    const resultTextElement = document.getElementById('result-text');
    resultTextElement.innerHTML = resultText;
    resultTextElement.style.color = resultColor; // 텍스트 색상 설정

    document.getElementById('comment-text').innerHTML = commentText;

    // #survey_result가 표시되도록 설정
    resultElement.style.display = 'block';
}

// 초기 로드 시 #survey_result와 에러 메시지를 숨김
document.getElementById('survey_result').style.display = 'none';
document.getElementById('error-message').textContent = '';

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

        if (Pw === currentPw) {
            if (Pw != newPw && newPw.length >= 7) {                 // 비밀번호 길이
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
                document.getElementById('mypage_error1').innerHTML = "이전 비밀번호와 같거나 너무 짧습니다";
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
            const confirmation = confirm("정말로 탈퇴하시겠습니까?");
            if(confirmation){
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
            }else {
                alert("탈퇴가 취소되었습니다.");
            }
        } else {
            document.getElementById('mypage_error2').innerHTML = "비밀번호가 일치하지 않습니다";
        }


    });
});

let strength2 = 0;
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register_pw2").addEventListener("input", function () {
        const password = this.value;
        const meter = document.getElementById("meter2");
        const errorText = document.getElementById("mypage_error3");

        strength2 = 0;

        // 비밀번호 보안 강도 체크
        if (/[A-Z]+/.test(password)) strength2++; // 대문자 포함
        if (/[a-z]+/.test(password)) strength2++; // 소문자 포함
        if (/[0-9]/.test(password)) strength2++; // 숫자 포함
        if (/[\W_]/.test(password)) strength2++; // 특수 문자 포함

        // 프로그래스 바와 텍스트 업데이트
        meter.value = strength2;

        switch (strength2) {
            case 0:
                errorText.textContent = "보안강도";
                errorText.style.color = "black";
                break;
            case 1:
                errorText.textContent = "보안 강도: 매우 약함";
                errorText.style.color = "red";
                break;
            case 2:
                errorText.textContent = "보안 강도: 약함";
                errorText.style.color = "orange";
                break;
            case 3:
                errorText.textContent = "보안 강도: 보통";
                errorText.style.color = "yellowgreen";
                break;
            case 4:
                errorText.textContent = "보안 강도: 강함";
                errorText.style.color = "green";
                break;
        }
    });
});

const Pw = document.getElementById('pw_check').innerHTML;
