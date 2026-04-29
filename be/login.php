<?php
session_start();
include 'koneksi.php';

$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE nama='$username' AND password='$password'";
$result = mysqli_query($conn, $query);

$user = mysqli_fetch_assoc($result);

if ($user) {
    $_SESSION['login'] = true;
    $_SESSION['user'] = $user['nama'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        "status" => "success",
        "role" => $user['role']
    ]);
} else {
    echo json_encode([
        "status" => "error"
    ]);
}
?>