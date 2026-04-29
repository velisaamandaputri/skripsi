<?php
include 'koneksi.php';

header('Content-Type: application/json');

if (isset($_GET['id']) && isset($_GET['kategori'])) {
    $id_alt = $_GET['id'];
    $kategori = $_GET['kategori'];

    $query = "SELECT a.nama, a.kode, p.C1, p.C2, p.C3, p.C4 
              FROM alternatif a 
              LEFT JOIN penilaian p ON a.id = p.alternatif_id 
              WHERE a.id = ? AND a.kategori = ?";
    
    $stmt = mysqli_prepare($conn, $query);
    
    if (!$stmt) {
        die(json_encode(["error" => mysqli_error($conn)]));
    }

    mysqli_stmt_bind_param($stmt, "is", $id_alt, $kategori);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data = mysqli_fetch_assoc($result);

    echo json_encode($data);

} else if (isset($_GET['kategori'])) {
    $kategori = $_GET['kategori'];
    $query = "SELECT a.id, a.kode, a.nama, p.C1, p.C2, p.C3, p.C4 
              FROM alternatif a 
              LEFT JOIN penilaian p ON a.id = p.alternatif_id 
              WHERE a.kategori = ?";
              
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $kategori);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode($data);
}
?>