/**
 * 1. FUNGSI RENDER TABEL PENILAIAN (DYNAMIS)
 */
function renderPenilaianKategori(tableId, kategori) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;

    fetch(`be/get_alternatif.php?kategori=${kategori}`)
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach((item, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td class="center"><strong>${item.kode}</strong></td>
                        <td class="center">${item.nama}</td>
                        <td class="center">
                            <button class="act-btn edit" onclick="siapEditPenilaian(${item.id}, '${kategori}')">
                                <i class="fa-solid fa-pencil"></i> 
                            </button>
                        </td>
                    </tr>`;
            });

            const label = document.getElementById(`total-penilaian-${kategori}`);
            if (label) {
                label.innerHTML = `<i class="fa-solid fa-clipboard-check"></i> Total: ${data.length} produk`;
            }
        })
        .catch(err => console.error("Gagal memuat data penilaian:", err));
}

function siapEditPenilaian(id, kategori) {
    localStorage.setItem('editPenilaianId', id);
    localStorage.setItem('editPenilaianKategori', kategori);
    window.location.href = 'edit-penilaian.html';
}

document.addEventListener('DOMContentLoaded', () => {

    // A. Jalankan Render jika ada di halaman penilaian.html
    if (document.getElementById('tabel-body-penilaian-facewash')) {
        renderPenilaianKategori('tabel-body-penilaian-facewash', 'facewash');
        renderPenilaianKategori('tabel-body-penilaian-moisturizer', 'moisturizer');
        renderPenilaianKategori('tabel-body-penilaian-sunscreen', 'sunscreen');
    }

    // B. Logika Form Edit Penilaian (Halaman edit-penilaian.html)
    const formEditPenilaian = document.getElementById('form-edit-penilaian');
    if (formEditPenilaian) {
        const id = localStorage.getItem('editPenilaianId');
        const kategori = localStorage.getItem('editPenilaianKategori');

        // Tarik data penilaian yang sudah ada dari database
        fetch(`be/get_penilaian.php?id=${id}&kategori=${kategori}`)
            .then(res => res.json())
            .then(data => {
                if (document.getElementById('edit-label-produk')) {
                    document.getElementById('edit-label-produk').innerText = "Produk: " + (data.nama || "Unknown");
                }
                // Isi form dengan nilai C1-C7 dari database
                if (data) {
                    document.getElementById('edit_C1').value = data.C1 || '';
                    document.getElementById('edit_C2').value = data.C2 || '';
                    document.getElementById('edit_C3').value = data.C3 || '';
                    document.getElementById('edit_C4').value = data.C4 || '';
                    document.getElementById('edit_C5').value = data.C5 || '';
                    document.getElementById('edit_C6').value = data.C6 || '';
                    document.getElementById('edit_C7').value = data.C7 || '';
                }
            });

        formEditPenilaian.addEventListener('submit', (e) => {
            e.preventDefault();
            const payload = {
                id: id,
                kategori: kategori,
                C1: document.getElementById('edit_C1').value,
                C2: document.getElementById('edit_C2').value,
                C3: document.getElementById('edit_C3').value,
                C4: document.getElementById('edit_C4').value,
                C5: document.getElementById('edit_C5').value,
                C6: document.getElementById('edit_C6').value,
                C7: document.getElementById('edit_C7').value
            };

            fetch('be/simpan_penilaian.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status === 'success') {
                        alert("Penilaian berhasil disimpan!");
                        window.location.href = 'penilaian.html';
                    } else {
                        alert("Gagal menyimpan: " + (res.message || "Error server"));
                    }
                });
        });
    }
});

function renderSemuaTabelPenilaian() {
    // Memanggil fungsi render untuk masing-masing tabel yang ada di halaman penilaian.html
    renderPenilaianKategori('tabel-body-penilaian-facewash', 'facewash');
    renderPenilaianKategori('tabel-body-penilaian-moisturizer', 'moisturizer');
    renderPenilaianKategori('tabel-body-penilaian-sunscreen', 'sunscreen');
}

// Fungsi pembantu untuk mengubah angka ke keterangan teks
function getKeteranganNilai(angka) {
    const skor = parseInt(angka);
    if (skor >= 100) return "Sangat Aman";
    if (skor >= 75) return "Aman";
    if (skor >= 50) return "Cukup Aman";
    if (skor >= 25) return "Iritan/Tidak Aman";
    return "Belum Dinilai";
}