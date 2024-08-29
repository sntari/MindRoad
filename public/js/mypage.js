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