<?php
session_start();
header('Content-Type: application/json');
include 'koneksi.php';

// Cek koneksi database
if (!$conn) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Koneksi database gagal'
    ]);
    exit;
}

// Ambil username dari parameter GET
$username = isset($_GET['username']) ? mysqli_real_escape_string($conn, $_GET['username']) : '';

if (empty($username)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username tidak boleh kosong'
    ]);
    exit;
}

// Query untuk mengambil riwayat user tertentu, diurutkan dari yang terbaru
$query = "SELECT * FROM riwayat_pengguna 
          WHERE username = '$username' 
          ORDER BY created_at DESC";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Query gagal: ' . mysqli_error($conn)
    ]);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);

mysqli_close($conn);
?>
