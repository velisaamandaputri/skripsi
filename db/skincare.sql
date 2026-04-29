-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 29 Apr 2026 pada 14.58
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skincare`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `alternatif`
--

CREATE TABLE `alternatif` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kategori` enum('facewash','moisturizer','sunscreen') NOT NULL,
  `kulit` varchar(50) DEFAULT NULL,
  `masalah` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `alternatif`
--

INSERT INTO `alternatif` (`id`, `kode`, `nama`, `kategori`, `kulit`, `masalah`, `created_at`) VALUES
(4, 'UU', 'QQ', 'moisturizer', 'Berminyak', 'Kusam', '2026-04-20 16:59:18'),
(5, 'WA', 'XS', 'sunscreen', 'Kering', 'Kusam', '2026-04-20 18:10:06'),
(9, 'f1', 'Wardah Derma Sensitive Skin Rescue Moisturizer 50 G', 'facewash', 'Sensitif', 'Skin Barrier Rusak', '2026-04-21 01:38:34'),
(10, 'f2', 'Symradiance399 + 5% Niacinamide Bright & Barrier Booster Moisture Gel', 'facewash', 'Sensitif', 'Skin Barrier Rusak', '2026-04-21 01:42:07'),
(11, 'f3', 'emina', 'facewash', 'Normal', 'Kusam', '2026-04-21 01:54:02'),
(12, 'f4', 'avoskin', 'facewash', 'Normal', 'Kusam', '2026-04-21 01:54:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kriteria`
--

CREATE TABLE `kriteria` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `type` enum('Benefit','Cost') NOT NULL,
  `bobot` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kriteria`
--

INSERT INTO `kriteria` (`id`, `kode`, `nama`, `type`, `bobot`) VALUES
(1, 'C1', 'Komposisi Bahan', 'Benefit', 0.20),
(2, 'C2', 'Logo Halal', 'Benefit', 0.20),
(3, 'C3', 'Daftar BPOM', 'Benefit', 0.15),
(4, 'C4', 'Status Kandungan', 'Benefit', 0.10),
(7, 'C5', 'Permasalahan Kulit', 'Benefit', 0.15),
(8, 'C6', 'Jenis Kulit', 'Benefit', 0.10),
(9, 'C7', 'Usia', 'Cost', 0.10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `penilaian`
--

CREATE TABLE `penilaian` (
  `id` int(11) NOT NULL,
  `alternatif_id` int(11) NOT NULL,
  `C1` float DEFAULT 0,
  `C2` float DEFAULT 0,
  `C3` float DEFAULT 0,
  `C4` float DEFAULT 0,
  `C5` float DEFAULT 0,
  `C6` float DEFAULT 0,
  `C7` float DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `penilaian`
--

INSERT INTO `penilaian` (`id`, `alternatif_id`, `C1`, `C2`, `C3`, `C4`, `C5`, `C6`, `C7`, `created_at`, `updated_at`) VALUES
(27, 4, 100, 50, 75, 100, 100, 80, 25, '2026-04-20 17:22:16', '2026-04-29 11:38:47'),
(31, 9, 75, 100, 100, 75, 80, 60, 50, '2026-04-21 01:45:45', '2026-04-29 11:39:15'),
(32, 10, 100, 100, 100, 75, 40, 80, 75, '2026-04-21 01:46:17', '2026-04-29 11:39:38'),
(33, 11, 25, 75, 75, 25, 60, 40, 75, '2026-04-21 01:57:20', '2026-04-29 11:39:48'),
(34, 12, 75, 100, 100, 100, 40, 60, 50, '2026-04-21 01:57:43', '2026-04-29 11:39:57');

-- --------------------------------------------------------

--
-- Struktur dari tabel `riwayat_pengguna`
--

CREATE TABLE `riwayat_pengguna` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `jk` varchar(10) DEFAULT NULL,
  `usia` int(11) DEFAULT NULL,
  `tipe_kulit` varchar(50) DEFAULT NULL,
  `permasalahan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `riwayat_pengguna`
--

INSERT INTO `riwayat_pengguna` (`id`, `username`, `jk`, `usia`, `tipe_kulit`, `permasalahan`, `created_at`) VALUES
(1, 'User', 'Laki-laki', 18, 'Berminyak', 'Flek atau Hiperpigmentasi', '0000-00-00 00:00:00'),
(2, 'User', 'Laki-laki', 18, 'Berminyak', 'Flek atau Hiperpigmentasi', '0000-00-00 00:00:00'),
(3, 'User', 'Perempuan', 18, 'Sensitif', 'Skin Barrier Rusak', '0000-00-00 00:00:00'),
(4, 'User', 'Perempuan', 18, 'Normal', 'Kusam', '0000-00-00 00:00:00'),
(5, 'User', 'Perempuan', 18, 'Normal', 'Kusam', '0000-00-00 00:00:00'),
(6, 'User', 'Laki-laki', 18, 'Kering', 'Skin Barrier Rusak', '0000-00-00 00:00:00'),
(7, 'User', 'Laki-laki', 18, 'Berminyak', 'Kemerahan atau iritasi', '0000-00-00 00:00:00'),
(8, 'User', 'Perempuan', 18, 'Berminyak', 'Kusam', '0000-00-00 00:00:00'),
(9, 'User', 'Perempuan', 18, 'Normal', 'Skin Barrier Rusak', '0000-00-00 00:00:00'),
(10, 'User', 'Laki-laki', 18, 'Sensitif', 'Kemerahan atau iritasi', '0000-00-00 00:00:00'),
(11, 'User', 'Perempuan', 18, 'Kombinasi', 'Jerawat', '0000-00-00 00:00:00'),
(12, 'User', 'Perempuan', 18, 'Berminyak', 'Flek atau Hiperpigmentasi', '0000-00-00 00:00:00'),
(13, 'User', 'Laki-laki', 12, 'Berminyak', 'Pori-Pori besar dan Komedo', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`) VALUES
(1, 'admin_spk', 'admin@skincare.com', 'password_rahasia_admin', 'admin'),
(2, 'user', 'user@gmail.com', 'user123', 'user');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `alternatif`
--
ALTER TABLE `alternatif`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_alternatif` (`alternatif_id`);

--
-- Indeks untuk tabel `riwayat_pengguna`
--
ALTER TABLE `riwayat_pengguna`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `alternatif`
--
ALTER TABLE `alternatif`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `riwayat_pengguna`
--
ALTER TABLE `riwayat_pengguna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  ADD CONSTRAINT `fk_alternatif` FOREIGN KEY (`alternatif_id`) REFERENCES `alternatif` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
