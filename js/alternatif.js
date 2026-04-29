function renderTabelProduk(tableId, kategori, labelId) {
    const tbody = document.getElementById(tableId);
    const labelTotal = document.getElementById(labelId);

    if (!tbody) return;

    fetch(`be/get_alternatif.php?kategori=${kategori}`)
        .then(res => res.json())
        .then(data => {
            if (labelTotal) {
                labelTotal.innerHTML = `<i class="fa-solid fa-address-book"></i> Total: ${data.length} alternatif`;
            }

            tbody.innerHTML = '';
            data.forEach((item, index) => {
                tbody.innerHTML += `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td class="center"><strong>${item.kode}</strong></td>
                    <td class="center">${item.nama}</td>
                    <td>${item.kulit}</td>
                    <td>${item.masalah || '-'}</td>
                    <td class="center">
                        <button class="act-btn edit" onclick="editData(${item.id})">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="act-btn del" onclick="hapusData(${item.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });
        })
        .catch(err => console.error(`Gagal render tabel ${kategori}:`, err));
}

function renderSemuaTabelAlternatif() {
    renderTabelProduk('tabel-body-sunscreen', 'sunscreen', 'total-sunscreen');
    renderTabelProduk('tabel-body-alternatif', 'facewash', 'total-alternatif');
    renderTabelProduk('tabel-body-moisturizer', 'moisturizer', 'total-moisturizer');
}

function editData(id) {
    localStorage.setItem('edit_id', id);
    window.location.href = 'edit-alternatif.html';
}

function hapusData(id) {
    if (confirm("Yakin ingin menghapus data ini?")) {
        fetch(`be/hapus_alternatif.php?id=${id}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Data berhasil dihapus!");
                    location.reload();
                } else {
                    alert("Gagal menghapus data!");
                }
            });
    }
}


const formTambah = document.getElementById('form-tambah-alternatif');
// Form Tambah
if (formTambah) {
    formTambah.addEventListener('submit', (e) => {
        e.preventDefault();
        const kategori = document.getElementById('input_kategori').value;
        const dataBaru = {
            kode: document.getElementById('input_kode').value,
            nama: document.getElementById('input_nama').value,
            kulit: document.getElementById('input_kulit').value,
            masalah: document.getElementById('input_masalah').value
        };

        fetch('be/tambah_alternatif.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kategori, data: dataBaru })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Data berhasil disimpan ke database!");
                    window.location.href = 'alternatif.html';
                } else {
                    alert("Gagal menyimpan data!");
                }
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan render otomatis
    renderSemuaTabelAlternatif();

    // Form Edit
    const formEdit = document.getElementById('form-edit-alternatif');
    if (formEdit) {
        formEdit.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = localStorage.getItem('edit_id');
            const dataUpdate = {
                id: id,
                kode: document.getElementById('edit_alt_kode').value,
                nama: document.getElementById('edit_alt_nama').value,
                kulit: document.getElementById('edit_alt_kulit').value,
                masalah: document.getElementById('edit_alt_masalah').value
            };

            fetch('be/edit_alternatif.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataUpdate)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status === 'success') {
                        alert("Data berhasil diupdate!");
                        window.location.href = 'alternatif.html';
                    } else {
                        alert("Gagal update!");
                    }
                });
        });
    }
});