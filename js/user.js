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

    // Ambil data dari localStorage
    let dataUser = JSON.parse(localStorage.getItem('db_users'));

    // Jika benar-benar kosong, isi dengan default
    if (!dataUser || dataUser.length === 0) {
        dataUser = DEFAULT_USERS;
        localStorage.setItem('db_users', JSON.stringify(dataUser));
    }

    if (labelTotal) labelTotal.innerText = `Total: ${dataUser.length} User`;

    tbody.innerHTML = '';
    dataUser.forEach((user, index) => {
        const isAdmin = user.role === 'admin';

        tbody.innerHTML += `
            <tr>
                <td class="center">${index + 1}</td>
                <td>${user.nama}</td>
                <td>${user.email}</td>
                <td class="center">
                    <span class="badge-role" style="
                        background:${isAdmin ? '#ffebee' : '#e8f5e9'}; 
                        color:${isAdmin ? '#c62828' : '#2e7d32'}; 
                        border:none; padding: 5px 15px; border-radius: 20px; 
                        font-size: 12px; font-weight: bold; display: inline-block;">
                        ${user.role.toUpperCase()}
                    </span>
                </td>
                <td class="center">
                    ${isAdmin ? 
                        `<span style="color: #999; font-style: italic; font-size: 13px;"><i class="fa-solid fa-shield-halved"></i> Protected</span>` : 
                        `<button class="btn-hapus-user" onclick="hapusUser(${index})" 
                            style="background:#e53e3e; color:white; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">
                            <i class="fa-solid fa-trash"></i> Hapus
                        </button>`
                    }
                </td>
            </tr>
        `;
    });
}

/**
 * 3. LOGIKA HAPUS USER
 */
function hapusUser(index) {
    let dataUser = JSON.parse(localStorage.getItem('db_users')) || [];

    // Proteksi tambahan: Cek role
    if (dataUser[index] && dataUser[index].role === 'admin') {
        alert("Maaf, akun Admin Utama dilindungi sistem dan tidak dapat dihapus!");
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${dataUser[index].nama}"?`)) {
        dataUser.splice(index, 1);
        localStorage.setItem('db_users', JSON.stringify(dataUser));
        renderTabelUser(); 
    }
}

/**
 * 4. INITIALIZE
 */
document.addEventListener('DOMContentLoaded', renderTabelUser);