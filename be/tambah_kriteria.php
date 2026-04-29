<?php
include 'koneksi.php';
$data = json_decode(file_get_contents('php://input'), true);

$kode = $data['kode'];
$nama = $data['nama'];
$type = $data['type'];
$bobot = $data['bobot'];

$query = "INSERT INTO kriteria (kode, nama, type, bobot) VALUES ('$kode', '$nama', '$type', '$bobot')";
if (mysqli_query($conn, $query)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
?>