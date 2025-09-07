# Proyek Otomatisasi Tes Game Ular (Snake)

Proyek ini berisi serangkaian tes otomatis untuk memverifikasi fungsionalitas inti dan kasus tepi dari aplikasi web Snake Game. Tes ini dibangun menggunakan Playwright dan Cucumber, dengan menerapkan pola desain BDD (Behavior-Driven Development) dan POM (Page Object Model) untuk keterbacaan dan pemeliharaan kode yang maksimal.

## Struktur Proyek

-   `features/`: Berisi skenario tes fungsional dalam format Gherkin (`.feature`), yang mendeskripsikan perilaku aplikasi dari sudut pandang pengguna.
-   `features/step_definitions/`: Berisi kode implementasi (lem) yang menghubungkan langkah-langkah Gherkin ke tindakan otomatisasi di Playwright.
-   `pages/`: Berisi Page Object Classes. Setiap kelas bertanggung jawab untuk mengenkapsulasi locator dan metode interaksi untuk halaman atau komponen tertentu, memisahkan logika tes dari detail implementasi UI.
-   `cucumber.js`: File konfigurasi untuk Cucumber, termasuk pengaturan timeout dan format laporan.

## Cara Menjalankan Tes

1.  **Instal Dependensi:**
    Pastikan Node.js dan npm terinstal. Jalankan perintah berikut di root proyek:
    ```bash
    npm install
    ```

2.  **Jalankan Game Secara Lokal:**
    Proyek ini dirancang untuk menguji aplikasi Snake Game yang berjalan secara lokal. Pastikan game tersebut dapat diakses di `http://localhost:3456`.

3.  **Jalankan Suite Tes:**
    Eksekusi semua skenario tes dengan perintah:
    ```bash
    npm test
    ```

    Setelah selesai, laporan tes dalam format HTML yang mudah dibaca akan dibuat secara otomatis di `cucumber-report.html`.

## Strategi dan Cakupan Pengujian

Strategi pengujian berfokus pada validasi siklus permainan secara menyeluruh, mulai dari inisialisasi hingga kondisi akhir, serta menangani input pengguna yang tidak valid. Pendekatan ini memastikan keandalan aplikasi dan pengalaman pengguna yang mulus.

### Skenario yang Dicakup:

1.  **Verifikasi Dasar & Transisi Status:**
    -   `Successfully go to the game page`: Memastikan aplikasi berhasil dimuat.
    -   `Successfully start the game`: Menguji fungsionalitas tombol start dan inisialisasi game.
    -   `Pausing and resuming the game`: Memvalidasi alur interaksi pengguna yang paling umum.
    -   `Restarting the game after game over`: Memastikan siklus permainan dapat diulang dengan benar setelah selesai.

2.  **Kondisi Akhir (End Conditions):**
    -   `Game ends when the snake hits a wall`: Memverifikasi aturan permainan fundamental yang paling penting.

3.  **Kasus Tepi (Edge Cases):**
    -   `Pressing movement keys before the game starts`: Memastikan game tidak bereaksi terhadap input sebelum dimulai, mencegah status yang tidak valid.

## Potensi Peningkatan

-   **Pengujian Lintas Browser:** Menjalankan suite tes yang sama di berbagai browser (Firefox, WebKit) untuk memastikan kompatibilitas.
-   **Validasi Skor:** Mengimplementasikan kembali skenario untuk memverifikasi bahwa skor bertambah saat makanan dimakan.
-   **Kasus Tepi Lainnya:** Menambahkan tes untuk memvalidasi bahwa ular tidak bisa langsung berbalik arah (misalnya, menekan 'atas' saat bergerak ke 'bawah').
