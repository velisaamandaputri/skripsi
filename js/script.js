/**
 * SISTEM REKOMENDASI SAW - CONTROL CENTER
 * Mengatur inisialisasi fungsi berdasarkan keberadaan elemen dan halaman
 */

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('tabel-body-alternatif')) renderSemuaTabelAlternatif();
    if (document.getElementById('tabel-body-kriteria'))    renderTabelKriteria();
    if (document.getElementById('tabel-body-user'))        renderTabelUser();
    if (document.getElementById('tabel-body-riwayat'))     renderRiwayatAdmin();
    if (document.getElementById('tabel-riwayat-saya'))     renderRiwayatUserHanyaMilikSendiri();
    if (document.getElementById('tabel-body-penilaian-facewash')) renderSemuaTabelPenilaian();

    // --- 2. LOGIKA HALAMAN SPESIFIK (Berdasarkan URL) ---
    const path = window.location.pathname;

    // Halaman Matriks Perhitungan (Admin)
    if (path.includes('matriks.html')) {
        if (typeof hitungDanRenderSemuaMatriks === 'function') hitungDanRenderSemuaMatriks();
    }

    // Halaman Hasil Rekomendasi (Admin)
    if (path.includes('hasil-rekomendasi.html')) {
        if (typeof renderHasilAkhirAdmin === 'function') renderHasilAkhirAdmin();
    }

    // Halaman Beranda User & Hasil Rekomendasi (User)
    if (path.includes('hasil-rekomendasi-user.html') || path.includes('beranda-user.html')) {
        if (typeof renderHasilRekomendasiUser === 'function') renderHasilRekomendasiUser();
        // Gunakan fungsi beranda jika memang ada fungsi khusus untuk beranda
        if (typeof renderHasilRekomendasiBeranda === 'function') renderHasilRekomendasiBeranda();
    }

    // --- 3. HANDLER LOGOUT GLOBAL ---
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Keluar dari sistem?")) {
                // Opsional: Hapus session user jika ada
                // localStorage.removeItem('currentUser');
                
                alert("Logout Berhasil");
                window.location.href = 'index.html';
            }
        });
    }
});