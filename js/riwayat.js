/**
 * RENDER RIWAYAT USER (Hanya milik user yang login)
 */
async function renderRiwayatUserHanyaMilikSendiri() {
    const userAktif = localStorage.getItem('currentUser');
    const tbody = document.getElementById('tabel-riwayat-saya');

    if (!tbody) return;

    // Proteksi jika session user kosong (User belum login)
    if (!userAktif) {
        tbody.innerHTML = '<tr><td colspan="5" class="center">Silakan login untuk melihat riwayat.</td></tr>';
        return;
    }

    try {
        // Ambil data dari database dengan filter username
        const response = await fetch(`be/get_riwayat_user.php?username=${encodeURIComponent(userAktif)}`);
        const dataSaya = await response.json();

        if (!Array.isArray(dataSaya) || dataSaya.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="center">Belum ada riwayat rekomendasi.</td></tr>';
            return;
        }

        let html = '';
        dataSaya.forEach((item, index) => {
            html += `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td class="center">${item.jk}</td>
                    <td class="center">${item.usia} Th</td>
                    <td class="center">
                        <span class="badge-kulit">${item.tipe_kulit}</span>
                    </td>
                    <td>${item.permasalahan || '-'}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error("Gagal memuat riwayat user:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="center">Gagal mengambil data dari server.</td></tr>';
    }
}

/**
 * RENDER RIWAYAT ADMIN (Semua user)
 */
async function renderRiwayatAdmin() {
    const tbody = document.getElementById('tabel-body-riwayat');
    const labelTotal = document.getElementById('total-riwayat');

    if (!tbody) return;

    try {
        const response = await fetch('be/get_riwayat.php');
        const daftarRiwayat = await response.json();

        if (!Array.isArray(daftarRiwayat) || daftarRiwayat.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="center" style="padding: 30px;">Belum ada riwayat di database.</td></tr>';
            if (labelTotal) labelTotal.innerText = "Total: 0 data";
            return;
        }

        let html = '';
        daftarRiwayat.forEach((item, index) => {
            html += `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td class="center"><strong>${item.username || 'Guest'}</strong></td>
                    <td class="center">${item.jk}</td>
                    <td class="center">${item.usia} Th</td>
                    <td class="center">
                        <span class="badge-role" style="background:#e3f2fd; color:#1976d2; padding: 2px 8px; border-radius: 4px; font-weight:bold;">
                            ${item.tipe_kulit}
                        </span>
                    </td>
                    <td class="center">${item.permasalahan || '-'}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        if (labelTotal) labelTotal.innerText = `Total: ${daftarRiwayat.length} data`;
    } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
    }
}

/**
 * LOAD FILTER USER DARI DATABASE (untuk beranda dan hasil rekomendasi)
 */
async function loadFilterUserFromDatabase() {
    const userAktif = localStorage.getItem('currentUser');

    if (!userAktif) {
        console.warn('User belum login');
        return null;
    }

    try {
        const response = await fetch(`be/get_latest_filter_user.php?username=${encodeURIComponent(userAktif)}`);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
            // Simpan ke localStorage untuk kompatibilitas dengan kode lama
            localStorage.setItem('user_filter', JSON.stringify(result.data));
            return result.data;
        } else {
            console.warn('Belum ada data filter untuk user ini');
            return null;
        }
    } catch (error) {
        console.error('Gagal load filter user:', error);
        return null;
    }
}

/**
 * FORM MULAI REKOMENDASI
 */
document.addEventListener('DOMContentLoaded', () => {
    const formRekomendasi = document.getElementById('formRekomendasi');

    if (formRekomendasi) {
        formRekomendasi.addEventListener('submit', async function (e) {
            e.preventDefault();

            const userAktif = localStorage.getItem('currentUser');

            if (!userAktif) {
                alert('Anda belum login! Silakan login terlebih dahulu.');
                window.location.href = 'index.html';
                return;
            }

            // Ambil data dari form
            const dataInput = {
                username: userAktif,
                jk: document.getElementById('jk').value,
                usia: document.getElementById('usia').value,
                tipe_kulit: document.getElementById('tipe_kulit').value,
                masalah: document.getElementById('Permasalahan').value
            };

            // Disable tombol submit
            const submitBtn = formRekomendasi.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';

            try {
                // 1. Simpan ke localStorage (untuk kompatibilitas)
                localStorage.setItem('user_filter', JSON.stringify(dataInput));

                // 2. Simpan ke database
                const response = await fetch('be/simpan_riwayat.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataInput)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Redirect ke halaman hasil rekomendasi
                    window.location.href = 'hasil-rekomendasi-user.html';
                } else {
                    alert('Gagal menyimpan data: ' + result.message);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan. Silakan coba lagi.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Jalankan render jika elemen tabel ada di halaman tersebut
    if (document.getElementById('tabel-riwayat-saya')) {
        renderRiwayatUserHanyaMilikSendiri();
    }

    if (document.getElementById('tabel-body-riwayat')) {
        renderRiwayatAdmin();
    }

    // Load filter user dari database saat halaman beranda atau hasil rekomendasi dibuka
    const path = window.location.pathname;
    if (path.includes('beranda-user.html') || path.includes('hasil-rekomendasi-user.html')) {
        loadFilterUserFromDatabase();
    }
});
