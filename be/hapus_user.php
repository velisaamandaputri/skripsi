<?php
include 'koneksi.php';

// Ambil data JSON dari request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID user tidak ditemukan']);
    exit;
}

$id = intval($data['id']);

// Cek apakah user yang akan dihapus adalah admin
$checkQuery = "SELECT role FROM users WHERE id = $id";
$checkResult = mysqli_query($conn, $checkQuery);

if ($checkResult && mysqli_num_rows($checkResult) > 0) {
    $user = mysqli_fetch_assoc($checkResult);

    // Proteksi: Admin tidak bisa dihapus
    if ($user['role'] === 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Akun Admin tidak dapat dihapus!']);
        exit;
    }
}

// Hapus user dari database
$query = "DELETE FROM users WHERE id = $id AND role != 'admin'";

if (mysqli_query($conn, $query)) {
    if (mysqli_affected_rows($conn) > 0) {
        echo json_encode(['status' => 'success', 'message' => 'User berhasil dihapus']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User tidak ditemukan atau sudah dihapus']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus user: ' . mysqli_error($conn)]);
}
?>
