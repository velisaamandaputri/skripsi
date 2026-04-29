<?php
include 'koneksi.php';
$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$kode = $data['kode'];
$nama = $data['nama'];
$type = $data['type'];
$bobot = $data['bobot'];

$query = "UPDATE kriteria SET kode='$kode', nama='$nama', type='$type', bobot='$bobot' WHERE id=$id";

if (mysqli_query($conn, $query)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
?>