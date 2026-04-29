<?php
error_reporting(0);
include 'koneksi.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $username = mysqli_real_escape_string($conn, $data['username']);
    $jk = mysqli_real_escape_string($conn, $data['jk']);
    $usia = mysqli_real_escape_string($conn, $data['usia']);
    $tipe_kulit = mysqli_real_escape_string($conn, $data['tipe_kulit']);
    $permasalahan = mysqli_real_escape_string($conn, $data['masalah']);
    $tanggal = mysqli_real_escape_string($conn, $data['created_at']);
    $query = "INSERT INTO riwayat_pengguna (username, jk, usia, tipe_kulit, permasalahan, created_at) 
              VALUES ('$username', '$jk', '$usia', '$tipe_kulit', '$permasalahan', '$tanggal')";

    if (mysqli_query($conn, $query)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Riwayat berhasil disimpan'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => mysqli_error($conn)
        ]);
    }
}
mysqli_close($conn);
?>