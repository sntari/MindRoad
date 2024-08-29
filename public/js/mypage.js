function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// 게이지 그래프
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

// 꺾은 선 그래프
const labels = ["January", "February", "March", "April", "May", "June"]; // 레이블 및 데이터 값 input 값으로 수정
        const data = {
            labels: labels,
            datasets: [{
                label: 'Sample Line Chart',
                data: [65, 59, 80, 81, 56, 55], // 꺾은 선 그래프의 데이터 값
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
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
                text: '파이 그래프 예시'
            }
        }
    }
});

$(document).ready(function () {
    $('#info_re').on('click', function (event) {
        $('#info_r').submit(); // 폼을 제출
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