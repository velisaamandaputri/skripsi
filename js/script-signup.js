document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman refresh saat submit

    // 1. Ambil data dari input form
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // 2. Validasi: Pastikan Password dan Konfirmasi Password sama
    if (password !== confirm) {
        alert("Konfirmasi password tidak cocok! Silahkan periksa kembali.");
        return;
    }

    // 3. Ambil data user yang sudah ada di localStorage (db_users)
    // Jika belum ada data sama sekali, buat array kosong
    let daftarUser = JSON.parse(localStorage.getItem('db_users')) || [];

    // 4. Validasi: Cek apakah Username sudah digunakan oleh orang lain
    const isUsernameTaken = daftarUser.find(u => u.nama.toLowerCase() === username.toLowerCase());
    if (isUsernameTaken) {
        alert("Username sudah terdaftar! Silahkan gunakan username lain.");
        return;
    }

    // 5. Buat objek User baru
    const userBaru = {
        id: Date.now(), // ID unik menggunakan timestamp
        nama: username,
        email: email,
        password: password, // Disimpan untuk pengecekan login
        role: 'user' // Secara otomatis diset sebagai user (bukan admin)
    };

    // 6. Masukkan user baru ke dalam array daftarUser
    daftarUser.push(userBaru);

    // 7. Simpan kembali array yang sudah diperbarui ke localStorage
    localStorage.setItem('db_users', JSON.stringify(daftarUser));

    // 8. Berikan notifikasi sukses dan pindahkan ke halaman Login
    alert("Pendaftaran Berhasil! Akun Anda telah dibuat. Silahkan Login.");
    window.location.href = "index.html"; 
});