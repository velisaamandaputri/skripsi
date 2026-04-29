<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$kode = $data['kode'];
$nama = $data['nama'];
$kulit = $data['kulit'];
$masalah = $data['masalah'];

$query = "UPDATE alternatif 
          SET kode='$kode', nama='$nama', kulit='$kulit', masalah='$masalah'
          WHERE id='$id'";

if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>