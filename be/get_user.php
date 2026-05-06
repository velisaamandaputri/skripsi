<?php
include 'koneksi.php';

$query = "SELECT * FROM users where role = 'user'" ;

$result = mysqli_query($conn, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>