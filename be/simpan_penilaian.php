<?php
header('Content-Type: application/json');
include "koneksi.php"; 

// Cek koneksi database
if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal"
    ]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id = $data['id'] ?? null;
$C1 = mysqli_real_escape_string($conn, $data['C1'] ?? 0);
$C2 = mysqli_real_escape_string($conn, $data['C2'] ?? 0);
$C3 = mysqli_real_escape_string($conn, $data['C3'] ?? 0);
$C4 = mysqli_real_escape_string($conn, $data['C4'] ?? 0);
$C5 = mysqli_real_escape_string($conn, $data['C5'] ?? 0);
$C6 = mysqli_real_escape_string($conn, $data['C6'] ?? 0);
$C7 = mysqli_real_escape_string($conn, $data['C7'] ?? 0);

if ($id) {
    // Cek apakah data sudah ada
    $checkQuery = "SELECT id FROM penilaian WHERE alternatif_id='$id'";
    $checkResult = mysqli_query($conn, $checkQuery);
    
    if (mysqli_num_rows($checkResult) > 0) {
        // UPDATE data yang sudah ada
        $sql = "UPDATE penilaian 
                SET C1='$C1', C2='$C2', C3='$C3', C4='$C4', C5='$C5', C6='$C6', C7='$C7' 
                WHERE alternatif_id='$id'";
        
        if (mysqli_query($conn, $sql)) {
            echo json_encode([
                'status' => 'success', 
                'message' => 'Penilaian berhasil diperbarui',
                'data' => [
                    'alternatif_id' => $id,
                    'C1' => $C1, 'C2' => $C2, 'C3' => $C3, 'C4' => $C4,
                    'C5' => $C5, 'C6' => $C6, 'C7' => $C7
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error', 
                'message' => 'Gagal update: ' . mysqli_error($conn)
            ]);
        }
    } else {
        // INSERT data baru
        $sqlInsert = "INSERT INTO penilaian (alternatif_id, C1, C2, C3, C4, C5, C6, C7) 
                      VALUES ('$id', '$C1', '$C2', '$C3', '$C4', '$C5', '$C6', '$C7')";
        
        if (mysqli_query($conn, $sqlInsert)) {
            echo json_encode([
                'status' => 'success', 
                'message' => 'Penilaian baru berhasil ditambahkan',
                'data' => [
                    'alternatif_id' => $id,
                    'C1' => $C1, 'C2' => $C2, 'C3' => $C3, 'C4' => $C4,
                    'C5' => $C5, 'C6' => $C6, 'C7' => $C7
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error', 
                'message' => 'Gagal simpan data baru: ' . mysqli_error($conn)
            ]);
        }
    }
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'ID alternatif tidak boleh kosong'
    ]);
}
?>
