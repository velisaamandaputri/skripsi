<?php
include 'koneksi.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $query = "SELECT * FROM alternatif WHERE id='$id'";
} else {
    $kategori = $_GET['kategori'];
    $query = "SELECT * FROM alternatif WHERE kategori='$kategori'";
}

$result = mysqli_query($conn, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>