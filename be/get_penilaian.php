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

// GET SINGLE PENILAIAN (untuk edit)
if (isset($_GET['id']) && isset($_GET['kategori'])) {
    $id_alt = mysqli_real_escape_string($conn, $_GET['id']);
    $kategori = mysqli_real_escape_string($conn, $_GET['kategori']);

    $query = "SELECT a.nama, a.kode, 
              COALESCE(p.C1, 0) as C1, 
              COALESCE(p.C2, 0) as C2, 
              COALESCE(p.C3, 0) as C3, 
              COALESCE(p.C4, 0) as C4,
              COALESCE(p.C5, 0) as C5,
              COALESCE(p.C6, 0) as C6,
              COALESCE(p.C7, 0) as C7
              FROM alternatif a 
              LEFT JOIN penilaian p ON a.id = p.alternatif_id 
              WHERE a.id = '$id_alt' AND a.kategori = '$kategori'";
    
    $result = mysqli_query($conn, $query);
    
    if (!$result) {
        echo json_encode([
            "status" => "error",
            "message" => "Query gagal: " . mysqli_error($conn)
        ]);
        exit;
    }

    $data = mysqli_fetch_assoc($result);
    
    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Data tidak ditemukan"
        ]);
    }
}
// GET ALL PENILAIAN BY KATEGORI
else if (isset($_GET['kategori'])) {
    $kategori = mysqli_real_escape_string($conn, $_GET['kategori']);
    
    $query = "SELECT a.id, a.kode, a.nama, 
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
}
// GET ALL PENILAIAN
else {
    $query = "SELECT a.id, a.kode, a.nama, a.kategori,
              COALESCE(p.C1, 0) as C1, 
              COALESCE(p.C2, 0) as C2, 
              COALESCE(p.C3, 0) as C3, 
              COALESCE(p.C4, 0) as C4,
              COALESCE(p.C5, 0) as C5,
              COALESCE(p.C6, 0) as C6,
              COALESCE(p.C7, 0) as C7
              FROM alternatif a 
              LEFT JOIN penilaian p ON a.id = p.alternatif_id 
              ORDER BY a.kategori, a.kode ASC";
              
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
}
?>
