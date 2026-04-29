document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah halaman refresh saat submit

    // 1. Ambil data dari input form
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // 2. Validasi: Pastikan semua field diisi
    if (!username || !email || !password || !confirm) {
        alert("Semua field harus diisi!");
        return;
    }

    // 3. Validasi: Username minimal 3 karakter
    if (username.length < 3) {
        alert("Username minimal 3 karakter!");
        return;
    }

    // 4. Validasi: Password minimal 6 karakter
    if (password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
    }

    // 5. Validasi: Pastikan Password dan Konfirmasi Password sama
    if (password !== confirm) {
        alert("Konfirmasi password tidak cocok! Silahkan periksa kembali.");
        return;
    }

    // 6. Validasi: Format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Format email tidak valid!");
        return;
    }

    // 7. Disable tombol submit untuk mencegah double click
    const submitBtn = document.querySelector('.btn-signup-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';

    // 8. Kirim data ke backend
    fetch('be/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
        .then(response => {
            // Cek apakah response adalah JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                // Jika bukan JSON, kembalikan text untuk debugging
                return response.text().then(text => {
                    console.error("Response bukan JSON:", text);
                    throw new Error("Server mengembalikan response yang tidak valid");
                });
            }
        })
        .then(data => {
            // Enable kembali tombol submit
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            if (data.status === "success") {
                alert(data.message || "Pendaftaran Berhasil! Akun Anda telah dibuat. Silahkan Login.");

                // Redirect ke halaman login
                window.location.href = "index.html";
            } else {
                alert(data.message || "Pendaftaran gagal! Silahkan coba lagi.");
            }
        })
        .catch(error => {
            // Enable kembali tombol submit
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            console.error("Error:", error);
            alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.\n\nDetail: " + error.message);
        });
});

// Validasi real-time untuk username
document.getElementById('reg-username').addEventListener('input', function (e) {
    const username = e.target.value.trim();
    const feedback = document.getElementById('username-feedback');

    if (username.length > 0 && username.length < 3) {
        if (!feedback) {
            const feedbackEl = document.createElement('small');
            feedbackEl.id = 'username-feedback';
            feedbackEl.style.color = 'red';
            feedbackEl.textContent = 'Username minimal 3 karakter';
            e.target.parentElement.appendChild(feedbackEl);
        }
    } else {
        if (feedback) {
            feedback.remove();
        }
    }
});

// Validasi real-time untuk password
document.getElementById('reg-password').addEventListener('input', function (e) {
    const password = e.target.value;
    const feedback = document.getElementById('password-feedback');

    if (password.length > 0 && password.length < 6) {
        if (!feedback) {
            const feedbackEl = document.createElement('small');
            feedbackEl.id = 'password-feedback';
            feedbackEl.style.color = 'red';
            feedbackEl.textContent = 'Password minimal 6 karakter';
            e.target.parentElement.appendChild(feedbackEl);
        }
    } else {
        if (feedback) {
            feedback.remove();
        }
    }
});

// Validasi real-time untuk confirm password
document.getElementById('reg-confirm').addEventListener('input', function (e) {
    const password = document.getElementById('reg-password').value;
    const confirm = e.target.value;
    const feedback = document.getElementById('confirm-feedback');

    if (confirm.length > 0 && password !== confirm) {
        if (!feedback) {
            const feedbackEl = document.createElement('small');
            feedbackEl.id = 'confirm-feedback';
            feedbackEl.style.color = 'red';
            feedbackEl.textContent = 'Password tidak cocok';
            e.target.parentElement.appendChild(feedbackEl);
        }
    } else {
        if (feedback) {
            feedback.remove();
        }
    }
});
