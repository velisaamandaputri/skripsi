/**
 * USER SESSION MANAGEMENT
 * File ini mengelola session user dan proteksi halaman
 */

/**
 * Cek apakah user sudah login
 */
function isUserLoggedIn() {
    const username = localStorage.getItem('currentUser');
    const userId = localStorage.getItem('currentUserId');
    return username && userId;
}

/**
 * Get current user info
 */
function getCurrentUser() {
    return {
        username: localStorage.getItem('currentUser'),
        userId: localStorage.getItem('currentUserId'),
        role: localStorage.getItem('currentUserRole')
    };
}

/**
 * Proteksi halaman - redirect ke login jika belum login
 */
function protectPage() {
    if (!isUserLoggedIn()) {
        alert('Anda belum login! Silakan login terlebih dahulu.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Update nama user di topbar
 */
function updateUserNameInTopbar() {
    const user = getCurrentUser();
    const userNameElements = document.querySelectorAll('.user-name-title');

    if (user.username && userNameElements.length > 0) {
        userNameElements.forEach(el => {
            el.textContent = user.username;
        });
    }
}

/**
 * Logout user
 */
function logoutUser() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        // Hapus session dari localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserRole');
        localStorage.removeItem('user_filter');

        // Redirect ke login
        window.location.href = 'index.html';
    }
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
    const logoutButtons = document.querySelectorAll('.btn-logout-card, .btn-logout');

    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    });
}

/**
 * Initialize user session
 * Panggil fungsi ini di setiap halaman user
 */
function initUserSession() {
    // Proteksi halaman
    if (!protectPage()) return;

    // Update nama user di topbar
    updateUserNameInTopbar();

    // Setup logout button
    setupLogoutButton();
}

// Auto-run untuk halaman user
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Jika di halaman user (bukan admin dan bukan login/signup)
    if (path.includes('beranda-user.html') ||
        path.includes('mulai-rekomendasi.html') ||
        path.includes('hasil-rekomendasi-user.html')) {
        initUserSession();
    }
});
