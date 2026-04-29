<?php
header('Content-Type: application/json');
include "koneksi.php"; 

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id = $data['id'] ?? null;
$C1 = $data['C1'] ?? 0;
$C2 = $data['C2'] ?? 0;
$C3 = $data['C3'] ?? 0;
$C4 = $data['C4'] ?? 0;

if ($id) {
    $sql = "UPDATE penilaian SET C1='$C1', C2='$C2', C3='$C3', C4='$C4' WHERE alternatif_id='$id'";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Data diperbarui']);
        } else {
            $sqlInsert = "INSERT INTO penilaian (alternatif_id, C1, C2, C3, C4) VALUES ('$id', '$C1', '$C2', '$C3', '$C4')";
            if (mysqli_query($conn, $sqlInsert)) {
                echo json_encode(['status' => 'success', 'message' => 'Data baru ditambahkan']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Gagal simpan data baru']);
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID Kosong']);
}
?>