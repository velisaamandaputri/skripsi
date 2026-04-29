document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInp = document.getElementById('username').value.trim();
    const passInp = document.getElementById('password').value;

    fetch('be/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${userInp}&password=${passInp}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Login berhasil!");

            if (data.role === 'admin') {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "beranda-user.html";
            }
        } else {
            alert("Username atau password salah!");
        }
    });
});