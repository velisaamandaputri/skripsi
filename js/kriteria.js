const DEFAULT_KRITERIA = [
    { kode: 'C1', nama: 'Komposisi Bahan', type: 'Benefit', bobot: '0.4' },
    { kode: 'C2', nama: 'Logo Halal', type: 'Benefit', bobot: '0.3' },
    { kode: 'C3', nama: 'Daftar BPOM', type: 'Benefit', bobot: '0.3' },
    { kode: 'C4', nama: 'Status Kandungan', type: 'Benefit', bobot: '0.1' }
];

function renderTabelKriteria() {
    const tbody = document.getElementById('tabel-body-kriteria');
    const totalLabel = document.getElementById('total-kriteria');
    if (!tbody) return;

    fetch('be/get_kriteria.php')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach((item, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td class="center"><strong>${item.kode}</strong></td>
                        <td>${item.nama}</td>
                        <td>${item.type}</td>
                        <td class="center"><strong>${item.bobot}</strong></td>
                        <td class="center">
                            <button class="act-btn edit" onclick="editKriteria(${item.id})">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="act-btn del" onclick="hapusKriteria(${item.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>`;
            });
            if (totalLabel) {
                totalLabel.innerHTML = `<i class="fa-solid fa-list-check"></i> Total: ${data.length} kriteria`;
            }
        }).catch(err => console.error("Gagal memuat kriteria:", err));
}

const formTambahKriteria = document.getElementById('form-tambah-kriteria');
if (formTambahKriteria) {
    formTambahKriteria.addEventListener('submit', (e) => {
        e.preventDefault();
        const dataBaru = {
            kode: document.getElementById('krit_kode').value,
            nama: document.getElementById('krit_nama').value,
            type: document.getElementById('krit_type').value,
            bobot: document.getElementById('krit_bobot').value
        };

        fetch('be/tambah_kriteria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataBaru)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Kriteria Berhasil Disimpan ke Database!");
                    window.location.href = 'kriteria.html';
                } else {
                    alert("Gagal menyimpan kriteria: " + (res.message || "Error server"));
                }
            });
    });
}

function hapusKriteria(id) {
    if (confirm("Hapus kriteria ini dari database?")) {
        fetch(`be/hapus_kriteria.php?id=${id}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Kriteria berhasil dihapus!");
                    renderTabelKriteria();
                } else {
                    alert("Gagal menghapus data!");
                }
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formEditKriteria = document.getElementById('form-edit-kriteria');
    if (formEditKriteria) {
        const id = localStorage.getItem('edit_kriteria_id');

        if (!id) {
            alert("ID Kriteria tidak ditemukan!");
            window.location.href = 'kriteria.html';
            return;
        }

        // 1. Ambil data lama dari database berdasarkan ID
        fetch(`be/get_kriteria.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                // Isi input form dengan data dari database
                if (data) {
                    document.getElementById('edit_krit_kode').value = data.kode || '';
                    document.getElementById('edit_krit_nama').value = data.nama || '';
                    document.getElementById('edit_krit_type').value = data.type || 'Benefit';
                    document.getElementById('edit_krit_bobot').value = data.bobot || '';
                }
            })
            .catch(err => console.error("Gagal mengambil data kriteria:", err));

        // 2. Handler saat form Edit disubmit
        formEditKriteria.addEventListener('submit', (e) => {
            e.preventDefault();

            const dataUpdate = {
                id: id,
                kode: document.getElementById('edit_krit_kode').value,
                nama: document.getElementById('edit_krit_nama').value,
                type: document.getElementById('edit_krit_type').value,
                bobot: document.getElementById('edit_krit_bobot').value
            };

            fetch('be/edit_kriteria.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataUpdate)
            })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Kriteria berhasil diperbarui!");
                    localStorage.removeItem('edit_kriteria_id'); 
                    window.location.href = 'kriteria.html';
                } else {
                    alert("Gagal memperbarui kriteria: " + (res.message || "Terjadi kesalahan"));
                }
            })
            .catch(err => console.error("Gagal mengirim data update:", err));
        });
    }
});
function editKriteria(id) {
    localStorage.setItem('edit_kriteria_id', id);
    window.location.href = 'edit-kriteria.html';
}