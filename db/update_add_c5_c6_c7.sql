-- ============================================
-- UPDATE DATABASE: Tambah Kolom C5, C6, C7
-- ============================================
-- File ini menambahkan 3 kriteria baru ke tabel penilaian
-- Jalankan query ini di phpMyAdmin atau MySQL client

USE db_skincare;

-- Tambah kolom C5, C6, C7 ke tabel penilaian
ALTER TABLE `penilaian` 
ADD COLUMN `C5` FLOAT DEFAULT 0 AFTER `C4`,
ADD COLUMN `C6` FLOAT DEFAULT 0 AFTER `C5`,
ADD COLUMN `C7` FLOAT DEFAULT 0 AFTER `C6`;

-- Tambah data kriteria C5, C6, C7 ke tabel kriteria
INSERT INTO `kriteria` (`kode`, `nama`, `type`, `bobot`) VALUES
('C5', 'Permasalahan Kulit', 'Benefit', 0.10),
('C6', 'Jenis Kulit', 'Benefit', 0.10),
('C7', 'Usia', 'Benefit', 0.10);

-- Verifikasi struktur tabel
DESCRIBE penilaian;
SELECT * FROM kriteria;

-- ============================================
-- SELESAI!
-- ============================================
-- Sekarang tabel penilaian memiliki kolom:
-- id, alternatif_id, C1, C2, C3, C4, C5, C6, C7, created_at, updated_at
-- 
-- Dan tabel kriteria memiliki 7 kriteria:
-- C1, C2, C3, C4, C5, C6, C7
-- ============================================
