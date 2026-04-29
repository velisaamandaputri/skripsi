<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$kategori = $data['kategori'];
$d = $data['data'];

$kode = $d['kode'];
$nama = $d['nama'];
$kulit = $d['kulit'];
$masalah = $d['masalah'];

$query = "INSERT INTO alternatif (kode, nama, kategori, kulit, masalah) 
          VALUES ('$kode','$nama','$kategori','$kulit','$masalah')";

if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>