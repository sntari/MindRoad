function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// 긍정 및 부정 수치 입력
const positive = 70; // 예시 값, 실제로는 사용자 입력에 따라 변경
const negative = 30; // 예시 값, 실제로는 사용자 입력에 따라 변경

// 캔버스 요소 가져오기
const ctx = document.getElementById('myChart').getContext('2d');

// Chart.js를 사용해 막대 그래프 생성
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['긍정', '부정'],
        datasets: [{
            label: '긍정 vs 부정',
            data: [positive, negative],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',  // 긍정
                'rgba(255, 99, 132, 0.2)'   // 부정
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',  // 긍정
                'rgba(255, 99, 132, 1)'   // 부정
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});