<?php
session_start();
header('Content-Type: application/json');
include 'koneksi.php';

if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal"
    ]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak lengkap. Username, email, dan password harus diisi."
    ]);
    exit;
}

$username = mysqli_real_escape_string($conn, trim($data['username']));
$email = mysqli_real_escape_string($conn, trim($data['email']));
$password = mysqli_real_escape_string($conn, $data['password']);

if (strlen($username) < 3) {
    echo json_encode([
        "status" => "error",
        "message" => "Username minimal 3 karakter"
    ]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode([
        "status" => "error",
        "message" => "Password minimal 6 karakter"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "message" => "Format email tidak valid"
    ]);
    exit;
}

$checkUsername = "SELECT id FROM users WHERE nama = '$username'";
$resultUsername = mysqli_query($conn, $checkUsername);

if (mysqli_num_rows($resultUsername) > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Username sudah terdaftar! Silahkan gunakan username lain."
    ]);
    exit;
}

$checkEmail = "SELECT id FROM users WHERE email = '$email'";
$resultEmail = mysqli_query($conn, $checkEmail);

if (mysqli_num_rows($resultEmail) > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email sudah terdaftar! Silahkan gunakan email lain."
    ]);
    exit;
}

$insertQuery = "INSERT INTO users (nama, email, password, role) 
                VALUES ('$username', '$email', '$password', 'user')";

if (mysqli_query($conn, $insertQuery)) {
    $newUserId = mysqli_insert_id($conn);
    
    echo json_encode([
        "status" => "success",
        "message" => "Pendaftaran berhasil! Akun Anda telah dibuat.",
        "data" => [
            "id" => $newUserId,
            "username" => $username,
            "email" => $email,
            "role" => "user"
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal menyimpan data: " . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>
