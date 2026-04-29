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

// Query untuk mengambil data filter terakhir user
$query = "SELECT * FROM riwayat_pengguna 
          WHERE username = '$username' 
          ORDER BY created_at DESC 
          LIMIT 1";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Query gagal: ' . mysqli_error($conn)
    ]);
    exit;
}

$data = mysqli_fetch_assoc($result);

if ($data) {
    // Format data sesuai dengan yang dibutuhkan frontend
    echo json_encode([
        'status' => 'success',
        'data' => [
            'username' => $data['username'],
            'jk' => $data['jk'],
            'usia' => $data['usia'],
            'tipe_kulit' => $data['tipe_kulit'],
            'masalah' => $data['permasalahan'],
            'Permasalahan' => $data['permasalahan'], // Alias untuk kompatibilitas
            'created_at' => $data['created_at']
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Belum ada data rekomendasi untuk user ini'
    ]);
}

mysqli_close($conn);
?>
