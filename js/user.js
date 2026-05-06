/**
 * 1. CONFIGURASI USER DEFAULT
 */
const DEFAULT_USERS = [
    {
        id: Date.now(),
        nama: 'admin_spk',
        email: 'admin@skincare.com',
        password: 'admin', // Sebaiknya di-hash jika di production
        role: 'admin'
    }
];

/**
 * 2. RENDER TABEL USER
 */
function renderTabelUser() {

    const tbody = document.getElementById('tabel-body-user');
    const labelTotal = document.getElementById('total-user-label');
    if (!tbody) return;

    fetch('be/get_user.php')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach((user, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td><strong>${user.nama}</strong></td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn-hapus" onclick="hapusUser(${user.id}, '${user.nama}', '${user.role}')" 
                                style="background-color: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                <i class="fa-solid fa-trash"></i> 
                            </button>
                        </td>
                    </tr>`;
            });
            if (labelTotal) {
                labelTotal.innerHTML = `Total: ${data.length} User`;
            }
        }).catch(err => console.error("Gagal memuat user:", err));
}

/**
 * 3. LOGIKA HAPUS USER
 */
async function hapusUser(id, nama, role) {
    // Proteksi: Admin tidak bisa dihapus
    if (role === 'admin') {
        alert("Maaf, akun Admin dilindungi sistem dan tidak dapat dihapus!");
        return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${nama}"?`)) {
        return;
    }

    try {
        const response = await fetch('be/hapus_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('User berhasil dihapus!');
            renderTabelUser(); // Refresh tabel
        } else {
            alert('Gagal menghapus user: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus user.');
    }
}

/**
 * 4. INITIALIZE
 */
document.addEventListener('DOMContentLoaded', renderTabelUser);