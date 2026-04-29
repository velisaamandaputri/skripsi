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

// Ambil data dari request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Data tidak valid'
    ]);
    exit;
}

// Validasi input
$username = isset($data['username']) ? mysqli_real_escape_string($conn, $data['username']) : '';
$jk = isset($data['jk']) ? mysqli_real_escape_string($conn, $data['jk']) : '';
$usia = isset($data['usia']) ? mysqli_real_escape_string($conn, $data['usia']) : '';
$tipe_kulit = isset($data['tipe_kulit']) ? mysqli_real_escape_string($conn, $data['tipe_kulit']) : '';
$permasalahan = isset($data['masalah']) ? mysqli_real_escape_string($conn, $data['masalah']) : '';

// Validasi username tidak boleh kosong
if (empty($username)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username tidak boleh kosong. Silakan login terlebih dahulu.'
    ]);
    exit;
}

// Insert ke database
$query = "INSERT INTO riwayat_pengguna (username, jk, usia, tipe_kulit, permasalahan) 
          VALUES ('$username', '$jk', '$usia', '$tipe_kulit', '$permasalahan')";

if (mysqli_query($conn, $query)) {
    $insertId = mysqli_insert_id($conn);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Riwayat berhasil disimpan',
        'data' => [
            'id' => $insertId,
            'username' => $username,
            'jk' => $jk,
            'usia' => $usia,
            'tipe_kulit' => $tipe_kulit,
            'permasalahan' => $permasalahan
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal menyimpan riwayat: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>
