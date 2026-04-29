<?php
$conn = mysqli_connect("localhost", "root", "", "skincare");

if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
}
?>