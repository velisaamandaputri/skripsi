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
        const response = await fetch(`be/get_riwayat.php?username=${userAktif}`);
        const dataSaya = await response.json();

        if (dataSaya.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="center">Belum ada riwayat rekomendasi.</td></tr>';
            return;
        }

        let html = '';
        // Karena di PHP sudah di-ORDER BY created_at DESC, tidak perlu .reverse() lagi
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

async function renderRiwayatAdmin() {
    const tbody = document.getElementById('tabel-body-riwayat');
    const labelTotal = document.getElementById('total-riwayat');

    if (!tbody) return;

    try {
        const response = await fetch('be/get_riwayat.php');
        const daftarRiwayat = await response.json();

        if (daftarRiwayat.length === 0) {
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
                    <td class = "center">${item.permasalahan || '-'}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        if (labelTotal) labelTotal.innerText = `Total: ${daftarRiwayat.length} data`;
    } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
    }
}

async function bersihkanRiwayat() {
    if (confirm("Hapus semua riwayat data dari database?")) {
        const res = await fetch('be/hapus_riwayat.php', { method: 'POST' });
        const data = await res.json();
        if (data.status === 'success') {
            renderRiwayatAdmin();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cek halaman dan jalankan fungsi yang sesuai
    renderRiwayatUserHanyaMilikSendiri();
    renderRiwayatAdmin();
});


const formMulai = document.getElementById('form-mulai-rekomendasi');

if (formMulai) {
    formMulai.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Ambil Data dari Form
        const filterData = {
            username: localStorage.getItem('currentUser') || 'Guest',
            jk: document.getElementById('input_jk').value,
            usia: document.getElementById('input_usia').value,
            tipe_kulit: document.getElementById('input_kulit').value,
            masalah: document.getElementById('input_masalah').value,
            kategori: 'facewash', 
            tanggal: new Date().toISOString().split('T')[0]
        };

        // 2. Simpan ke LocalStorage 
        localStorage.setItem('user_filter', JSON.stringify(filterData));

        // 3. Simpan ke Database (Tabel Riwayat)
        fetch('be/simpan_riwayat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filterData)
        })
            .then(res => res.json())
            .then(res => {
                // Kita gunakan alert hanya sebagai konfirmasi
                console.log("Riwayat tersimpan:", res);
                window.location.href = 'hasil-rekomendasi-user.html';
            })
            .catch(err => {
                console.error("Gagal simpan riwayat ke DB, tapi tetap lanjut ke hasil:", err);
                window.location.href = 'hasil-rekomendasi-user.html';
            });
    });
}

/**
 * FUNGSI: Mengirim data riwayat input user ke server via AJAX/Fetch
 * @param {Object} filterData - Objek berisi jk, usia, tipe_kulit, masalah, dll.
 */
function simpanRiwayatKeDatabase(filterData) {
    // Melakukan request POST ke file backend PHP
    return fetch('be/simpan_riwayat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Mengubah objek JavaScript menjadi string JSON agar bisa dibaca PHP
        body: JSON.stringify(filterData)
    })
        .then(res => {
            // Cek jika respon server tidak oke (misal 404 atau 500)
            if (!res.ok) throw new Error('Respon server bermasalah');
            return res.json();
        })
        .then(res => {
            if (res.status === 'success') {
                console.log("✅ Riwayat tersimpan di database.");
            } else {
                console.error("❌ Gagal simpan riwayat:", res.message);
            }
        })
        .catch(err => {
            console.error("⚠️ Terjadi kesalahan koneksi atau sistem:", err);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const formRekomendasi = document.getElementById('formRekomendasi');

    if (formRekomendasi) {
        formRekomendasi.addEventListener('submit', function (e) {
            e.preventDefault();

            // Ambil data sesuai dengan ID yang ada di file HTML
            const dataInput = {
                username: localStorage.getItem('currentUser') || 'User',
                jk: document.getElementById('jk').value,
                usia: document.getElementById('usia').value,
                tipe_kulit: document.getElementById('tipe_kulit').value,
                masalah: document.getElementById('Permasalahan').value, 
                tanggal: new Date().toISOString().split('T')[0]
            };

            // 1. Simpan ke localStorage untuk mesin SAW
            localStorage.setItem('user_filter', JSON.stringify(dataInput));

            // 2. Kirim ke Database
            simpanRiwayatBaru(dataInput);
        });
    }

    // Jalankan render jika elemen tabel ada di halaman tersebut
    if (document.getElementById('tabel-riwayat-saya')) renderRiwayatUserHanyaMilikSendiri();
    if (document.getElementById('tabel-body-riwayat')) renderRiwayatAdmin();
});

// Fungsi pengiriman ke PHP
function simpanRiwayatBaru(dataInput) {
    return fetch('be/simpan_riwayat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataInput)
    })
        .then(res => {
            return res.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    throw new Error("Respon server bukan JSON: " + text);
                }
            });
        })
        .then(res => {
            if (res.status === 'success') {
                alert("Berhasil: " + res.message); // ALERT SUKSES
                window.location.href = "hasil-rekomendasi-user.html";
            } else {
                alert("Gagal Database: " + res.message); // ALERT GAGAL DB
                console.error(res.message);
            }
        })
        .catch(err => {
            alert("Terjadi Error Sistem: " + err.message); // ALERT ERROR KONEKSI/PHP
            console.error("Error:", err);
        });
}

async function renderHasilRekomendasiBeranda() {
    // Ambil data filter terakhir dari user
    const filterUser = JSON.parse(localStorage.getItem('user_filter'));

    if (!filterUser) {
        const pesanKosong = '<tr><td colspan="6" class="center">Silakan lakukan konsultasi terlebih dahulu.</td></tr>';
        if (document.querySelector('#tabel-beranda-facewash tbody')) document.querySelector('#tabel-beranda-facewash tbody').innerHTML = pesanKosong;
        if (document.querySelector('#tabel-beranda-moisturizer tbody')) document.querySelector('#tabel-beranda-moisturizer tbody').innerHTML = pesanKosong;
        if (document.querySelector('#tabel-beranda-sunscreen tbody')) document.querySelector('#tabel-beranda-sunscreen tbody').innerHTML = pesanKosong;
        return;
    }

    // List kategori dan ID tabelnya
    const daftarKategori = [
        { kategori: 'facewash', id: 'tabel-beranda-facewash' },
        { kategori: 'moisturizer', id: 'tabel-beranda-moisturizer' },
        { kategori: 'sunscreen', id: 'tabel-beranda-sunscreen' }
    ];

    for (const item of daftarKategori) {
        const tbody = document.querySelector(`#${item.id} tbody`);
        if (!tbody) continue;

        try {
            const results = await hitungSAW(item.kategori);

            // Filter sesuai tipe kulit user
            const filtered = results.filter(p =>
                p.kulit.toLowerCase() === filterUser.tipe_kulit.toLowerCase()
            );

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="center">Tidak ada produk yang cocok.</td></tr>';
                continue;
            }

            // Tampilkan 3 besar saja di beranda
            const top3 = filtered.slice(0, 3);

            tbody.innerHTML = top3.map((res, index) => `
                <tr>
                    <td class="center">A${res.kode.replace(/\D/g, '')}</td>
                    <td class="center">${filterUser.usia} Th</td>
                    <td class="center">${filterUser.tipe_kulit}</td>
                    <td>${filterUser.masalah || filterUser.Permasalahan || '-'}</td>
                    <td><strong>${res.nama}</strong></td>
                    <td class="center">
                        <span class="badge-rank" style="background:#ff9a9e; color:white; padding:2px 8px; border-radius:10px; font-weight:bold;">
                            #${index + 1}
                        </span>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error(`Gagal render beranda ${item.kategori}:`, error);
        }
    }
}