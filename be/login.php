<?php
// Set header JSON agar response selalu dalam format JSON
header('Content-Type: application/json');

session_start();
include 'koneksi.php';

// Cek koneksi database
if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal"
    ]);
    exit;
}

// Validasi input
if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Username dan password harus diisi"
    ]);
    exit;
}

$username = mysqli_real_escape_string($conn, $_POST['username']);
$password = mysqli_real_escape_string($conn, $_POST['password']);

$query = "SELECT * FROM users WHERE nama='$username' AND password='$password'";
$result = mysqli_query($conn, $query);

// Cek jika query gagal
if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => "Query gagal: " . mysqli_error($conn)
    ]);
    exit;
}

$user = mysqli_fetch_assoc($result);

if ($user) {
    $_SESSION['login'] = true;
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user'] = $user['nama'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        "status" => "success",
        "role" => $user['role'],
        "user_id" => $user['id'],
        "username" => $user['nama']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Username atau password salah"
    ]);
}
?>