# Encoding Base64 - Tugas Kuliah

**Nama Kelompok:** 
Bintang Putra Nagari  (23550010)
Amelia Tiani (23550014)
Nurisa eka putri (23550036)

**Repository:** [https://github.com/Flmori/Encoding-base64.git](https://github.com/Flmori/Encoding-base64.git)

## Perbandingan Implementasi Autentikasi

## Folder `auth-app`

**Implementasi Autentikasi Standar**

- Menggunakan metode autentikasi konvensional
- Password disimpan dengan hashing biasa (bcrypt)
- Tidak menggunakan encoding Base64
- Cocok untuk implementasi dasar autentikasi
- Struktur folder:
  ```
  auth-app/
  ├── server/       # Backend dengan autentikasi standar
  └── client/       # Frontend React biasa
  ```

## Folder `auth-app-base64`

**Implementasi Autentikasi dengan Base64**

- Menggunakan encoding Base64 untuk pertukaran data
- Password diencode dengan Base64 sebelum hashing
- Data sensitif diencode dalam transmisi
- Cocok untuk studi kasus encoding/decoding
- Struktur folder:
  ```
  auth-app-base64/
  ├── server/       # Backend dengan implementasi Base64
  └── client/       # Frontend dengan fitur encoding
  ```

## Detail Implementasi

- Dokumentasi lengkap dan file proyek tersedia di: [https://github.com/Flmori/Encoding-base64.git](https://github.com/Flmori/Encoding-base64.git)
- Untuk penjelasan detail masing-masing implementasi, lihat README.md di dalam folder auth-app dan auth-app-base64

## Kontak

Instagram: [@bin_mori](https://instagram.com/bin_mori)
