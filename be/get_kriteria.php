<?php
include 'koneksi.php';

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $query = "SELECT * FROM kriteria WHERE id='$id'";
    $result = mysqli_query($conn, $query);

    $data = mysqli_fetch_assoc($result);
} else {
    $query = "SELECT * FROM kriteria ORDER BY kode ASC";
    $result = mysqli_query($conn, $query);

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
}

// Jika data kosong, kirim null agar JS tidak error saat JSON.parse
echo json_encode($data ? $data : null);
?>