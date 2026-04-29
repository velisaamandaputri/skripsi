<?php
include 'koneksi.php';
header('Content-Type: application/json');

$kategori = isset($_GET['kategori']) ? $_GET['kategori'] : '';

$query = "SELECT a.kode, a.nama, a.kulit, p.C1, p.C2, p.C3, p.C4 
          FROM alternatif a 
          LEFT JOIN penilaian p ON a.id = p.alternatif_id 
          WHERE a.kategori = '$kategori'";

$result = mysqli_query($conn, $query);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);