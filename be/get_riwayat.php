<?php
include 'koneksi.php';
header('Content-Type: application/json');

$user = isset($_GET['username']) ? $_GET['username'] : '';

if ($user != '') {
    $query = "SELECT * FROM riwayat_pengguna WHERE username = '$user' ORDER BY created_at DESC";
} else {
    $query = "SELECT * FROM riwayat_pengguna ORDER BY created_at DESC";
}

$result = mysqli_query($conn, $query);
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}
echo json_encode($data);