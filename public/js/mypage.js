function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    if (tabName == "info_r") {
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

    } if (tabName == "delete_ID") {

    }
    document.getElementById(tabName).style.display = "block";
}
