<?php
include 'koneksi.php';
header('Content-Type: application/json');

// Cek koneksi database
if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal"
    ]);
    exit;
}

$kategori = isset($_GET['kategori']) ? mysqli_real_escape_string($conn, $_GET['kategori']) : '';

if (empty($kategori)) {
    echo json_encode([
        "status" => "error",
        "message" => "Parameter kategori tidak boleh kosong"
    ]);
    exit;
}

// Query dengan 7 kriteria (C1-C7)
$query = "SELECT a.kode, a.nama, a.kulit, 
          COALESCE(p.C1, 0) as C1, 
          COALESCE(p.C2, 0) as C2, 
          COALESCE(p.C3, 0) as C3, 
          COALESCE(p.C4, 0) as C4,
          COALESCE(p.C5, 0) as C5,
          COALESCE(p.C6, 0) as C6,
          COALESCE(p.C7, 0) as C7
          FROM alternatif a 
          LEFT JOIN penilaian p ON a.id = p.alternatif_id 
          WHERE a.kategori = '$kategori'
          ORDER BY a.kode ASC";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => "Query gagal: " . mysqli_error($conn)
    ]);
    exit;
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
