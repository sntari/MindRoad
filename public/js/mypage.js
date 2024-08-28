function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

    // 서버에서 전달된 값 (긍정-부정 수치)
    const value = <%= value %>;

    // 캔버스 요소 가져오기
    const ctx = document.getElementById('myGaugeChart').getContext('2d');

    // 게이지 차트 생성
    const myGaugeChart = new Chart(ctx, {
        type: 'gauge',
        data: {
            datasets: [{
                value: value,
                minValue: 0,
                data: [100], // 최대값 설정
                backgroundColor: ['#FF6384'],
                borderWidth: 2,
                needle: {
                    radiusPercentage: 2,
                    widthPercentage: 3.2,
                    lengthPercentage: 80,
                    color: 'rgba(0, 0, 0, 1)'
                }
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '긍정에서 부정까지의 수치'
            },
            layout: {
                padding: {
                    bottom: 10
                }
            },
            needle: {
                // 바늘 옵션
                color: 'rgba(0, 0, 0, 1)'
            },
            valueLabel: {
                // 수치 표시 옵션
                formatter: Math.round,
                display: true
            }
        }
    });