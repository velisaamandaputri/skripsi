<?php
include 'koneksi.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID riwayat tidak ditemukan']);
    exit;
}

$id = intval($data['id']);

$query = "DELETE FROM riwayat_pengguna WHERE id = $id";

if (mysqli_query($conn, $query)) {
    if (mysqli_affected_rows($conn) > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Riwayat berhasil dihapus']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Riwayat tidak ditemukan atau sudah dihapus']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus riwayat: ' . mysqli_error($conn)]);
}
?>
