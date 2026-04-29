document.getElementById('loginForm').addEventListener('submit', function (e) {
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
        .then(res => {
            // Cek apakah response adalah JSON
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return res.json();
            } else {
                // Jika bukan JSON, kembalikan text untuk debugging
                return res.text().then(text => {
                    console.error("Response bukan JSON:", text);
                    throw new Error("Server mengembalikan response yang tidak valid");
                });
            }
        })
        .then(data => {
            if (data.status === "success") {
                alert("Login berhasil!");

                // Simpan session user ke localStorage
                localStorage.setItem('currentUser', data.username);
                localStorage.setItem('currentUserId', data.user_id);
                localStorage.setItem('currentUserRole', data.role);

                if (data.role === 'admin') {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "beranda-user.html";
                }
            } else {
                alert(data.message || "Username atau password salah!");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat login. Silakan coba lagi.");
        });
});