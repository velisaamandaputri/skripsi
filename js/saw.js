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
                parseFloat(p.C4) || 0,
                parseFloat(p.C5) || 0,
                parseFloat(p.C6) || 0,
                parseFloat(p.C7) || 0
            ]
        };
    });

    console.log(`\n========== PERHITUNGAN SAW KATEGORI: ${kategori.toUpperCase()} ==========`);
    console.log('\n1. MATRIKS KEPUTUSAN (X) - Data Asli:');
    console.table(matrixX.map(m => ({
        Kode: m.kode,
        Nama: m.nama,
        C1: m.vals[0],
        C2: m.vals[1],
        C3: m.vals[2],
        C4: m.vals[3],
        C5: m.vals[4],
        C6: m.vals[5],
        C7: m.vals[6]
    })));

    // 4. Cari Nilai Max dan Min untuk Normalisasi
    const maxValues = [
        Math.max(...matrixX.map(m => m.vals[0])) || 1,
        Math.max(...matrixX.map(m => m.vals[1])) || 1,
        Math.max(...matrixX.map(m => m.vals[2])) || 1,
        Math.max(...matrixX.map(m => m.vals[3])) || 1,
        Math.max(...matrixX.map(m => m.vals[4])) || 1,
        Math.max(...matrixX.map(m => m.vals[5])) || 1,
        Math.max(...matrixX.map(m => m.vals[6])) || 1
    ];

    const minValues = [
        Math.min(...matrixX.map(m => m.vals[0])) || 1,
        Math.min(...matrixX.map(m => m.vals[1])) || 1,
        Math.min(...matrixX.map(m => m.vals[2])) || 1,
        Math.min(...matrixX.map(m => m.vals[3])) || 1,
        Math.min(...matrixX.map(m => m.vals[4])) || 1,
        Math.min(...matrixX.map(m => m.vals[5])) || 1,
        Math.min(...matrixX.map(m => m.vals[6])) || 1
    ];

    console.log('\n2. NILAI MAKSIMUM & MINIMUM SETIAP KRITERIA:');
    console.table({
        'C1 (Kandungan Bahan)': { Max: maxValues[0], Min: minValues[0], Type: 'Benefit' },
        'C2 (Label Halal)': { Max: maxValues[1], Min: minValues[1], Type: 'Benefit' },
        'C3 (Daftar BPOM)': { Max: maxValues[2], Min: minValues[2], Type: 'Benefit' },
        'C4 (Keamanan Bahan)': { Max: maxValues[3], Min: minValues[3], Type: 'Benefit' },
        'C5 (Permasalahan Kulit)': { Max: maxValues[4], Min: minValues[4], Type: 'Benefit' },
        'C6 (Jenis Kulit)': { Max: maxValues[5], Min: minValues[5], Type: 'Benefit' },
        'C7 (Usia)': { Max: maxValues[6], Min: minValues[6], Type: 'Cost ⚠️' }
    });

    // 5. Ambil Bobot W dari Database
    const W = dbKrit.map(k => parseFloat(k.bobot) || 0);

    console.log('\n3. BOBOT KRITERIA (W):');
    console.table(dbKrit.map((k, i) => ({
        Kriteria: k.kode,
        Nama: k.nama,
        Bobot: W[i].toFixed(2)
    })));

    // 6. Hitung Nilai Ternormalisasi (R)
    // C1-C6: Benefit (semakin tinggi semakin baik) → R = X / Max
    // C7: Cost (semakin rendah semakin baik) → R = Min / X
    let results = matrixX.map(m => {
        const r = [
            m.vals[0] / maxValues[0],                    // C1: Benefit
            m.vals[1] / maxValues[1],                    // C2: Benefit
            m.vals[2] / maxValues[2],                    // C3: Benefit
            m.vals[3] / maxValues[3],                    // C4: Benefit
            m.vals[4] / maxValues[4],                    // C5: Benefit
            m.vals[5] / maxValues[5],                    // C6: Benefit
            m.vals[6] > 0 ? minValues[6] / m.vals[6] : 0 // C7: Cost (rumus terbalik)
        ];

        // Perhitungan SAW: (r * W)
        // r : hasil normalisasi
        // W : bobot kriteria dari database
        const v = (r[0] * W[0]) + (r[1] * W[1]) + (r[2] * W[2]) + (r[3] * W[3]) +
            (r[4] * W[4]) + (r[5] * W[5]) + (r[6] * W[6]);

        return {
            ...m,
            r: r,
            vi: v
        };
    });

    console.log('\n4. MATRIKS TERNORMALISASI (R) - Hasil Normalisasi:');
    console.log('   📌 C1-C6: Benefit (R = X/Max) | C7: Cost (R = Min/X)');
    console.table(results.map(res => ({
        Kode: res.kode,
        Nama: res.nama,
        'R1 (C1/Max)': res.r[0].toFixed(4),
        'R2 (C2/Max)': res.r[1].toFixed(4),
        'R3 (C3/Max)': res.r[2].toFixed(4),
        'R4 (C4/Max)': res.r[3].toFixed(4),
        'R5 (C5/Max)': res.r[4].toFixed(4),
        'R6 (C6/Max)': res.r[5].toFixed(4),
        'R7 (Min/C7) ⚠️': res.r[6].toFixed(4)
    })));

    console.log('\n5. PERHITUNGAN NILAI PREFERENSI (V):');
    results.forEach(res => {
        const detail = res.r.map((r, i) => `(${r.toFixed(4)} × ${W[i]})`).join(' + ');
        console.log(`${res.kode} - ${res.nama}:`);
        console.log(`  V = ${detail}`);
        console.log(`  V = ${res.vi.toFixed(4)}`);
    });

    const sortedResults = results.sort((a, b) => b.vi - a.vi);

    console.log('\n6. RANKING AKHIR (Terurut dari Tertinggi):');
    console.table(sortedResults.map((res, index) => ({
        Ranking: index + 1,
        Kode: res.kode,
        Nama: res.nama,
        'Nilai Preferensi (V)': res.vi.toFixed(4)
    })));

    console.log(`\n========== SELESAI PERHITUNGAN ${kategori.toUpperCase()} ==========\n`);

    return sortedResults;
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


    const filtered = allProducts.filter(p => p.kulit === filterUser.p_kulit);

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="center">Tidak ada produk cocok untuk tipe kulit ${filterUser.p_kulit}</td></tr>`;
    } else {
        filtered.forEach((res, index) => {
            tbody.innerHTML += `
                <tr>
                    <td class="center">${res.kode}</td>
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
            tbody.innerHTML = `<tr><td colspan="7" class="center">Tidak ada produk yang cocok.</td></tr>`;
            return;
        }

        // Render Baris Tabel
        tbody.innerHTML = filtered.map((res, index) => `
            <tr>
                <td class="center">${res.kode}</td>
                <td class="center">${filterUser.usia} Th</td>
                <td class="center">${res.kulit}</td>
                <td>${filterUser.masalah || filterUser.Permasalahan || '-'}</td>
                <td><strong>${res.nama}</strong></td>
                <td class="center">
                    <span style="background: #e3f2fd; color: #1976d2; padding: 4px 10px; border-radius: 8px; font-weight: bold;">
                        ${res.vi.toFixed(4)}
                    </span>
                </td>
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
    // Jalankan render jika tabel ada di halaman tersebut (untuk admin)
    if (document.getElementById('table-final-facewash')) {
        renderHasilAkhir('facewash', 'table-final-facewash');
        renderHasilAkhir('moisturizer', 'table-final-moisturizer');
        renderHasilAkhir('sunscreen', 'table-final-sunscreen');
    }

    // Jalankan render jika tabel ada di halaman hasil-rekomendasi-user.html
    if (document.getElementById('tabel-hasil-user-facewash')) {
        renderHasilAkhir('facewash', 'tabel-hasil-user-facewash');
        renderHasilAkhir('moisturizer', 'tabel-hasil-user-moisturizer');
        renderHasilAkhir('sunscreen', 'tabel-hasil-user-sunscreen');
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
    renderHasilAkhirBeranda('facewash', 'tabel-beranda-facewash');
    renderHasilAkhirBeranda('moisturizer', 'tabel-beranda-moisturizer');
    renderHasilAkhirBeranda('sunscreen', 'tabel-beranda-sunscreen');
}

/**
 * FUNGSI HELPER: renderHasilAkhirBeranda
 * Khusus untuk beranda user (6 kolom, top 3)
 */
async function renderHasilAkhirBeranda(kategori, idTabel) {
    const tbody = document.querySelector(`#${idTabel} tbody`);
    if (!tbody) {
        console.warn(`Tabel dengan ID ${idTabel} tidak ditemukan`);
        return;
    }

    try {
        const results = await hitungSAW(kategori);
        const filterUser = JSON.parse(localStorage.getItem('user_filter'));

        console.log(`\n📊 RENDER BERANDA - Kategori: ${kategori.toUpperCase()}`);
        console.log('Filter User:', filterUser);
        console.log('Total Products:', results.length);

        if (!filterUser) {
            tbody.innerHTML = '<tr><td colspan="7" class="center">Silakan isi data rekomendasi terlebih dahulu.</td></tr>';
            return;
        }

        // Filter berdasarkan tipe kulit user
        const filtered = results.filter(p =>
            p.kulit.toLowerCase() === filterUser.tipe_kulit.toLowerCase()
        );

        console.log('Filtered Products:', filtered.length);

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="center">Tidak ada produk yang cocok.</td></tr>';
            return;
        }

        // Tampilkan hanya Top 3 saja di Beranda agar tidak terlalu penuh
        const top3 = filtered.slice(0, 3);

        console.log('Top 3 Products:', top3.map(p => ({ kode: p.kode, nama: p.nama, vi: p.vi })));

        tbody.innerHTML = top3.map((res, index) => `
            <tr>
                <td class="center">${res.kode}</td>
                <td class="center">${filterUser.usia} Th</td>
                <td class="center">${filterUser.tipe_kulit}</td>
                <td>${filterUser.masalah || filterUser.Permasalahan || '-'}</td>
                <td><strong>${res.nama}</strong></td>
                <td class="center">
                    <span style="background: #e3f2fd; color: #1976d2; padding: 4px 10px; border-radius: 8px; font-weight: bold;">
                        ${res.vi.toFixed(4)}
                    </span>
                </td>
                <td class="center">
                    <span class="badge-rank" style="background: #ff9a9e; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold;">
                        #${index + 1}
                    </span>
                </td>
            </tr>
        `).join('');

        console.log(`✅ Berhasil render ${top3.length} produk untuk tabel ${idTabel}`);

    } catch (error) {
        console.error(`❌ Gagal render beranda kategori ${kategori}:`, error);
        tbody.innerHTML = '<tr><td colspan="7" class="center">Terjadi kesalahan saat memuat data.</td></tr>';
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
                    <td class="center">${res.kode}</td>
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