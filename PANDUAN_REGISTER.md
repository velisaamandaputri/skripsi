# 📝 PANDUAN: Sistem Register/Sign Up

## 🎯 Overview

Sistem register yang sudah dibuat memungkinkan user baru untuk mendaftar dengan:
- ✅ Username (minimal 3 karakter)
- ✅ Email (format valid)
- ✅ Password (minimal 6 karakter)
- ✅ Confirm Password (harus sama dengan password)

---

## 📂 File yang Dibuat/Diupdate

### **1. Backend PHP:**
- ✅ `be/register.php` - API endpoint untuk register

### **2. Frontend JavaScript:**
- ✅ `js/script-signup.js` - Logic untuk form register

### **3. HTML:**
- ✅ `signup.html` - Sudah ada (tidak perlu diubah)

---

## 🔐 Fitur Keamanan

### **1. Validasi Input**

#### **Frontend (JavaScript):**
- Username minimal 3 karakter
- Password minimal 6 karakter
- Email format valid
- Password dan Confirm Password harus sama
- Validasi real-time saat user mengetik

#### **Backend (PHP):**
- Escape string untuk mencegah SQL Injection
- Validasi ulang semua input
- Cek duplikasi username dan email
- Filter email dengan `FILTER_VALIDATE_EMAIL`

### **2. Password Hashing (RECOMMENDED)**

**Saat ini:** Password disimpan dalam **plain text** (tidak aman untuk production)

**Untuk Production:** Uncomment baris ini di `be/register.php`:

```php
// Hash password untuk keamanan (RECOMMENDED)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Ganti query INSERT
$insertQuery = "INSERT INTO users (nama, email, password, role) 
                VALUES ('$username', '$email', '$hashedPassword', 'user')";
```

**Dan update `be/login.php`:**

```php
// Ganti validasi password
if ($user) {
    // Jika menggunakan hash
    if (password_verify($password, $user['password'])) {
        $_SESSION['login'] = true;
        $_SESSION['user'] = $user['nama'];
        $_SESSION['role'] = $user['role'];
        
        echo json_encode([
            "status" => "success",
            "role" => $user['role']
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Password salah"
        ]);
    }
}
```

---

## 🚀 Cara Menggunakan

### **1. User Membuka Halaman Register**

URL: `http://localhost/signup.html`

### **2. User Mengisi Form:**

| Field | Validasi | Contoh |
|-------|----------|--------|
| Username | Min 3 karakter | `john_doe` |
| Email | Format email valid | `john@example.com` |
| Password | Min 6 karakter | `password123` |
| Confirm Password | Harus sama dengan password | `password123` |

### **3. User Klik "Sign Up"**

**Proses:**
1. JavaScript validasi input di frontend
2. Kirim data ke `be/register.php` via fetch API
3. PHP validasi ulang di backend
4. Cek duplikasi username dan email
5. Insert data ke database
6. Return response JSON

**Response Success:**
```json
{
  "status": "success",
  "message": "Pendaftaran berhasil! Akun Anda telah dibuat.",
  "data": {
    "id": 3,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response Error:**
```json
{
  "status": "error",
  "message": "Username sudah terdaftar! Silahkan gunakan username lain."
}
```

### **4. Redirect ke Login**

Setelah berhasil register, user otomatis diarahkan ke halaman login (`index.html`).

---

## 📊 Flow Diagram

```
┌─────────────────┐
│  User buka      │
│  signup.html    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Isi form:      │
│  - Username     │
│  - Email        │
│  - Password     │
│  - Confirm Pass │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validasi       │
│  Frontend (JS)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Valid?  │
    └────┬────┘
         │ Ya
         ▼
┌─────────────────┐
│  Kirim ke       │
│  be/register.php│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validasi       │
│  Backend (PHP)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Valid?  │
    └────┬────┘
         │ Ya
         ▼
┌─────────────────┐
│  Cek Duplikasi  │
│  Username/Email │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Duplikat│
    └────┬────┘
         │ Tidak
         ▼
┌─────────────────┐
│  Insert ke DB   │
│  tabel users    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return Success │
│  Response JSON  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect ke    │
│  index.html     │
│  (Login Page)   │
└─────────────────┘
```

---

## 🔍 Validasi Real-Time

### **Username:**
```javascript
// Saat user mengetik username
if (username.length < 3) {
    // Tampilkan pesan: "Username minimal 3 karakter"
}
```

### **Password:**
```javascript
// Saat user mengetik password
if (password.length < 6) {
    // Tampilkan pesan: "Password minimal 6 karakter"
}
```

### **Confirm Password:**
```javascript
// Saat user mengetik confirm password
if (password !== confirm) {
    // Tampilkan pesan: "Password tidak cocok"
}
```

---

## 🧪 Testing

### **Test Case 1: Register Berhasil**

**Input:**
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`
- Confirm: `password123`

**Expected:**
- ✅ Alert: "Pendaftaran Berhasil!"
- ✅ Redirect ke `index.html`
- ✅ Data tersimpan di database

**Verifikasi di Database:**
```sql
SELECT * FROM users WHERE nama = 'testuser';
```

---

### **Test Case 2: Username Sudah Terdaftar**

**Input:**
- Username: `admin_spk` (sudah ada di database)
- Email: `newemail@example.com`
- Password: `password123`
- Confirm: `password123`

**Expected:**
- ❌ Alert: "Username sudah terdaftar! Silahkan gunakan username lain."
- ❌ Tidak redirect
- ❌ Data tidak tersimpan

---

### **Test Case 3: Email Sudah Terdaftar**

**Input:**
- Username: `newuser`
- Email: `admin@skincare.com` (sudah ada di database)
- Password: `password123`
- Confirm: `password123`

**Expected:**
- ❌ Alert: "Email sudah terdaftar! Silahkan gunakan email lain."
- ❌ Tidak redirect
- ❌ Data tidak tersimpan

---

### **Test Case 4: Password Tidak Cocok**

**Input:**
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`
- Confirm: `password456` (berbeda)

**Expected:**
- ❌ Alert: "Konfirmasi password tidak cocok!"
- ❌ Tidak kirim request ke backend
- ❌ Data tidak tersimpan

---

### **Test Case 5: Username Terlalu Pendek**

**Input:**
- Username: `ab` (hanya 2 karakter)
- Email: `test@example.com`
- Password: `password123`
- Confirm: `password123`

**Expected:**
- ❌ Alert: "Username minimal 3 karakter!"
- ❌ Tidak kirim request ke backend
- ❌ Data tidak tersimpan

---

### **Test Case 6: Password Terlalu Pendek**

**Input:**
- Username: `testuser`
- Email: `test@example.com`
- Password: `12345` (hanya 5 karakter)
- Confirm: `12345`

**Expected:**
- ❌ Alert: "Password minimal 6 karakter!"
- ❌ Tidak kirim request ke backend
- ❌ Data tidak tersimpan

---

### **Test Case 7: Format Email Tidak Valid**

**Input:**
- Username: `testuser`
- Email: `invalidemail` (tanpa @)
- Password: `password123`
- Confirm: `password123`

**Expected:**
- ❌ Alert: "Format email tidak valid!"
- ❌ Tidak kirim request ke backend
- ❌ Data tidak tersimpan

---

## 🐛 Troubleshooting

### **Error: "Koneksi database gagal"**

**Penyebab:** Database tidak running atau koneksi salah

**Solusi:**
1. Pastikan XAMPP/WAMP/MAMP running
2. Cek `be/koneksi.php`:
   ```php
   $conn = mysqli_connect("localhost", "root", "", "db_skincare");
   ```
3. Pastikan database `db_skincare` sudah dibuat

---

### **Error: "Unexpected token < in JSON"**

**Penyebab:** PHP mengembalikan HTML error, bukan JSON

**Solusi:**
1. Buka `be/register.php` langsung di browser
2. Lihat error message yang muncul
3. Fix error di PHP
4. Pastikan `header('Content-Type: application/json')` ada di awal file

---

### **Error: "Username sudah terdaftar" padahal belum**

**Penyebab:** Case sensitivity atau whitespace

**Solusi:**
1. Cek database:
   ```sql
   SELECT * FROM users WHERE LOWER(nama) = LOWER('username');
   ```
2. Pastikan tidak ada whitespace di awal/akhir username

---

### **Data Tidak Tersimpan**

**Penyebab:** Query INSERT gagal

**Solusi:**
1. Cek error di response JSON
2. Cek struktur tabel `users`:
   ```sql
   DESCRIBE users;
   ```
3. Pastikan kolom `nama`, `email`, `password`, `role` ada

---

## 📝 Checklist Implementasi

- [x] Buat file `be/register.php`
- [x] Update file `js/script-signup.js`
- [x] Tambahkan validasi frontend
- [x] Tambahkan validasi backend
- [x] Tambahkan cek duplikasi username
- [x] Tambahkan cek duplikasi email
- [x] Tambahkan error handling
- [x] Tambahkan loading state
- [x] Tambahkan validasi real-time
- [ ] Test semua test case
- [ ] (Opsional) Implementasi password hashing

---

## 🔒 Rekomendasi Keamanan

### **1. Password Hashing**
Gunakan `password_hash()` dan `password_verify()` untuk keamanan password.

### **2. HTTPS**
Gunakan HTTPS di production untuk enkripsi data.

### **3. Rate Limiting**
Batasi jumlah request register dari IP yang sama.

### **4. CAPTCHA**
Tambahkan Google reCAPTCHA untuk mencegah bot.

### **5. Email Verification**
Kirim email verifikasi sebelum akun aktif.

### **6. Prepared Statements**
Gunakan prepared statements untuk mencegah SQL Injection:

```php
$stmt = $conn->prepare("INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $email, $password, $role);
$stmt->execute();
```

---

## ✅ Kesimpulan

Sistem register sudah lengkap dengan:
- ✅ Validasi frontend dan backend
- ✅ Cek duplikasi username dan email
- ✅ Error handling yang baik
- ✅ User experience yang smooth
- ✅ Response JSON yang konsisten

**Siap digunakan untuk development!** 🎉

Untuk production, jangan lupa implementasi password hashing dan keamanan tambahan.

---

**Dibuat oleh:** Kiro AI Assistant  
**Tanggal:** 29 April 2026  
**Versi:** 1.0
