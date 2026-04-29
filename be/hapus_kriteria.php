<?php
include 'koneksi.php';
$id = $_GET['id'];
$query = "DELETE FROM kriteria WHERE id = $id";
if (mysqli_query($conn, $query)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
?>