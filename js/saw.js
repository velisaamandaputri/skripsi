async function hitungSAW(kategori) {
    // 1. Ambil data gabungan (Alternatif + Nilai) dari Database
    const responseData = await fetch(`be/get_saw_data.php?kategori=${kategori}`);
    const products = await responseData.json();

    // 2. Ambil data Kriteria (Bobot) dari Database
    const responseKrit = await fetch(`be/get_kriteria.php`);
    const dbKrit = await responseKrit.json();

    if (products.length === 0) return [];

    // 3. Siapkan Matriks Keputusan (X) dari data Database
    let matrixX = products.map(p => {
        return {
            kode: p.kode,
            nama: p.nama,
            kulit: p.kulit,
            vals: [
                parseFloat(p.C1) || 0,
                parseFloat(p.C2) || 0,
                parseFloat(p.C3) || 0,
                parseFloat(p.C4) || 0
            ]
        };
    });

    // 4. Cari Nilai Max (Normalisasi)
    const maxValues = [
        Math.max(...matrixX.map(m => m.vals[0])) || 1,
        Math.max(...matrixX.map(m => m.vals[1])) || 1,
        Math.max(...matrixX.map(m => m.vals[2])) || 1,
        Math.max(...matrixX.map(m => m.vals[3])) || 1
    ];

    // 5. Ambil Bobot W dari Database
    // Pastikan urutan bobot di DB sesuai dengan C1, C2, C3, C4
    const W = dbKrit.map(k => parseFloat(k.bobot) || 0);

    // 6. Hitung V (Preferensi)
    let results = matrixX.map(m => {
        const r = [
            m.vals[0] / maxValues[0],
            m.vals[1] / maxValues[1],
            m.vals[2] / maxValues[2],
            m.vals[3] / maxValues[3]
        ];

        // Perhitungan SAW: (r * W)
        const v = (r[0] * W[0]) + (r[1] * W[1]) + (r[2] * W[2]) + (r[3] * W[3]);

        return {
            ...m,
            r: r,
            vi: v
        };
    });

    return results.sort((a, b) => b.vi - a.vi);
}

/**
 * RENDER TABEL UNTUK ADMIN (MATRIKS & RANKING)
 */
async function renderMatriksAdmin(kategori, prefixId) {
    try {
        const results = await hitungSAW(kategori);

        const tbodyX = document.querySelector(`#table-final-${prefixId} tbody`);
        const tbodyR = document.querySelector(`#table-final-${prefixId} tbody`);
        const tbodyV = document.querySelector(`#table-final-${prefixId} tbody`);

        // Jika tabel tidak ditemukan di HTML, berhenti
        if (!tbodyX || !tbodyR || !tbodyV) return;

        // Kosongkan tabel sekali di awal
        tbodyX.innerHTML = '';
        tbodyR.innerHTML = '';
        tbodyV.innerHTML = '';

        // Gunakan variabel penampung string untuk performa maksimal
        let htmlX = '';
        let htmlR = '';
        let htmlV = '';

        results.forEach((res, index) => {
            // 1. Baris Matriks Keputusan (X)
            const kolomX = res.vals.map(v => `<td class="center">${v}</td>`).join('');
            htmlX += `<tr>
                        <td class="center">${res.kode}</td>
                        ${kolomX}
                      </tr>`;

            // 2. Baris Matriks Ternormalisasi (R)
            const kolomR = res.r.map(r => `<td class="center">${r.toFixed(2)}</td>`).join('');
            htmlR += `<tr>
                        <td class="center">${res.kode}</td>
                        ${kolomR}
                      </tr>`;

            // 3. Baris Perhitungan Nilai Preferensi & Ranking (V)
            htmlV += `<tr>
                        <td class="center">${res.kode}</td>
                        <td>${res.nama}</td>
                        <td class="center"><strong>${res.vi.toFixed(3)}</strong></td>
                        <td class="center">${index + 1}</td>
                      </tr>`;
        });

        // Masukkan semua baris sekaligus (Hanya 1x manipulasi DOM per tabel)
        tbodyX.innerHTML = htmlX;
        tbodyR.innerHTML = htmlR;
        tbodyV.innerHTML = htmlV;

    } catch (error) {
        console.error(`Gagal merender matriks ${kategori}:`, error);
    }
}

/**
 * RENDER UNTUK BERANDA USER (DENGAN FILTER KULIT)
 */
async function renderRekomendasiUser() {
    const filterUser = JSON.parse(localStorage.getItem('user_filter'));
    const tbody = document.querySelector('#tabel-hasil-user tbody');
    if (!tbody) return;

    if (!filterUser) {
        tbody.innerHTML = '<tr><td colspan="4" class="center">Silahkan isi data filter terlebih dahulu.</td></tr>';
        return;
    }

    // Hitung semua kategori (Contoh: Face Wash)
    const allProducts = await hitungSAW('facewash');

    // FILTER: Hanya tampilkan yang tipe kulitnya cocok
    const filtered = allProducts.filter(p => p.kulit === filterUser.tipe_kulit);

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="center">Tidak ada produk cocok untuk tipe kulit ${filterUser.tipe_kulit}</td></tr>`;
    } else {
        filtered.forEach((res, index) => {
            tbody.innerHTML += `
                <tr>
                    <td class="center">A${res.kode.replace(/\D/g, '')}</td>
                    <td>${res.nama}</td>
                    <td class="center">${res.vi.toFixed(3)}</td>
                    <td class="center"><strong>#${index + 1}</strong></td>
                </tr>`;
        });
    }
}

// Inisialisasi saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('table-x-facewash')) {
        renderMatriksAdmin('facewash', 'facewash');
        renderMatriksAdmin('moisturizer', 'moisturizer');
        renderMatriksAdmin('sunscreen', 'sunscreen');
    }

    renderRekomendasiUser();
});

/**
 * RENDER KHUSUS HALAMAN HASIL REKOMENDASI (HANYA RANKING)
 */
/**
 * FUNGSI: Render hasil akhir rekomendasi ke tabel HTML
 * @param {string} kategori - Nama kategori (facewash, moisturizer, sunscreen)
 * @param {string} idTabel - ID tabel tanpa simbol #
 */
async function renderHasilAkhir(kategori, idTabel) {
    const tbody = document.querySelector(`#${idTabel} tbody`);
    if (!tbody) return;

    try {
        const results = await hitungSAW(kategori); 
        const filterUser = JSON.parse(localStorage.getItem('user_filter'));

        if (!filterUser) return;

        // Filter berdasarkan tipe kulit
        const filtered = results.filter(p =>
            p.kulit.toLowerCase() === filterUser.tipe_kulit.toLowerCase()
        );

        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="center">Tidak ada produk yang cocok.</td></tr>`;
            return;
        }

        // Render Baris Tabel
        tbody.innerHTML = filtered.map((res, index) => `
            <tr>
                <td class="center">A${res.kode.replace(/\D/g, '')}</td>
                <td class="center">${filterUser.usia} Th</td>
                <td class="center">${res.kulit}</td>
                <td>${filterUser.masalah || filterUser.Permasalahan || '-'}</td>
                <td><strong>${res.nama}</strong></td>
                <td class="center">
                    <span class="badge-rank" style="background: #ff9a9e; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold;">
                        #${index + 1}
                    </span>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(`Gagal render:`, error);
    }
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan render jika tabel ada di halaman tersebut
    if (document.getElementById('table-final-facewash')) {
        renderHasilAkhir('facewash', 'table-final-facewash');
        renderHasilAkhir('moisturizer', 'table-final-moisturizer');
        renderHasilAkhir('sunscreen', 'table-final-sunscreen');
    }
});

/**
 * RENDER BERANDA USER
 * Menampilkan pesan sapaan dan memicu perhitungan SAW untuk 3 kategori utama
 */
async function renderHasilRekomendasiBeranda() {
    const filterUser = JSON.parse(localStorage.getItem('user_filter'));
    const container = document.querySelector('.welcome-message'); // Elemen sapaan di HTML

    // 1. Jika User Belum Pernah Isi Filter
    if (!filterUser) {
        if (container) {
            container.innerHTML = `
                <h1>Halo, Selamat Datang!</h1>
                <p>Anda belum memiliki data profil kulit. Silahkan klik tombol di bawah untuk mendapatkan rekomendasi yang cocok.</p>
                <button class="btn-primary" style="margin-top:15px; padding:10px 20px; cursor:pointer;" 
                        onclick="window.location.href='mulai-rekomendasi.html'">
                    <i class="fa-solid fa-magnifying-glass"></i> Mulai Cari Produk
                </button>
            `;
        }
        return;
    }

    // 2. Jika Data Filter Ada, Tampilkan Sapaan Personal
    if (container) {
        container.innerHTML = `
            <h1>Halo, ${filterUser.username}!</h1>
            <p>Berdasarkan profil kulit <strong>${filterUser.tipe_kulit}</strong> Anda, berikut adalah rekomendasi produk terbaik:</p>
        `;
    }

    // 3. Jalankan Perhitungan & Render untuk 3 Kategori dari Database
    // Kita gunakan kategori yang sesuai dengan API (facewash, moisturizer, sunscreen)
    renderHasilAkhir('facewash', 'tabel-beranda-facewash');
    renderHasilAkhir('moisturizer', 'tabel-beranda-moisturizer');
    renderHasilAkhir('sunscreen', 'tabel-beranda-sunscreen');
}

/**
 * FUNGSI HELPER: renderHasilAkhir 
 * (Pastikan fungsi ini ada di js/saw.js Anda seperti yang kita bahas sebelumnya)
 */
async function renderHasilAkhir(kategori, idTabel) {
    const tbody = document.querySelector(`#${idTabel} tbody`);
    if (!tbody) return;

    try {
        const results = await hitungSAW(kategori);
        const filterUser = JSON.parse(localStorage.getItem('user_filter'));

        // Filter berdasarkan tipe kulit user
        const filtered = results.filter(p =>
            p.kulit.toLowerCase() === filterUser.tipe_kulit.toLowerCase()
        );

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="center">Tidak ada produk yang cocok.</td></tr>';
            return;
        }

        // Tampilkan hanya Top 3 saja di Beranda agar tidak terlalu penuh
        const top3 = filtered.slice(0, 3);

        tbody.innerHTML = top3.map((res, index) => `
            <tr>
                <td class="center">A${res.kode.replace(/\D/g, '')}</td>
                <td><strong>${res.nama}</strong></td>
                <td class="center">${res.vi.toFixed(3)}</td>
                <td class="center"><span class="badge-rank">#${index + 1}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(`Gagal render beranda kategori ${kategori}:`, error);
    }
}

/**
 * FUNGSI: Menghitung dan merender hasil ke tabel spesifik
 * Digunakan oleh renderHasilRekomendasiBeranda
 */
async function prosesHitungDanRenderUser(dbKey, tbodySelector, filter) {
    const tbody = document.querySelector(tbodySelector);
    if (!tbody) return;

    // 1. Tentukan kategori berdasarkan dbKey
    let kategori = 'facewash';
    if (dbKey === 'db_moisturizer') kategori = 'moisturizer';
    if (dbKey === 'db_sunscreen') kategori = 'sunscreen';

    try {
        // 2. Ambil data hasil perhitungan SAW yang sudah jadi dari database
        // Fungsi hitungSAW ini sudah mengembalikan data yang terurut (sorted)
        const allProducts = await hitungSAW(kategori);

        // 3. Filter berdasarkan tipe kulit yang diinput user
        const filtered = allProducts.filter(p =>
            p.kulit.toLowerCase() === filter.tipe_kulit.toLowerCase()
        );

        // 4. Render ke HTML
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="center">Tidak ada produk ${kategori} untuk kulit ${filter.tipe_kulit}</td></tr>`;
            return;
        }

        // Tampilkan Top 3 saja untuk Beranda
        const top3 = filtered.slice(0, 3);

        top3.forEach((res, index) => {
            tbody.innerHTML += `
                <tr>
                    <td class="center">A${res.kode.replace(/\D/g, '')}</td>
                    <td><strong>${res.nama}</strong></td>
                    <td class="center">${res.vi.toFixed(3)}</td>
                    <td class="center"><span class="badge-rank">#${index + 1}</span></td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(`Gagal memproses kategori ${kategori}:`, error);
        tbody.innerHTML = '<tr><td colspan="4" class="center">Gagal memuat data server.</td></tr>';
    }
}

async function renderHasilRekomendasiUser() {
    // Jalankan render untuk ketiga kategori
    renderHasilAkhir('facewash', 'tabel-hasil-user-facewash');
    renderHasilAkhir('moisturizer', 'tabel-hasil-user-moisturizer');
    renderHasilAkhir('sunscreen', 'tabel-hasil-user-sunscreen');
}