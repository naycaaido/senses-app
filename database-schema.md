Nomor Data
Nama Data
Atribut
Keterangan
Dt-1
Data Resepsionis
Id_Resepsionis,
Password,
Nama_Lengkap,
Telepon
Data yang digunakan untuk menyimpan identitas resepsionis sebagai staf operasional klinik yang memiliki akses ke sistem. 
Dt-2
Data Pasien
Email,
Password,
Nama_Lengkap,
Telepon,
Jenis_Kelamin,
Tempat_Lahir,
Tanggal_Lahir,
Pendidikan_Terakhir,
Pekerjaan,
Status, 
Agama,
Alamat_Domisili,
Kota
Data yang digunakan untuk menyimpan informasi pasien klinik
Dt-3
Data Jadwal
Id_Jadwal,
Tanggal,
Jam_Mulai
Jam_Selesai,
Status_Jadwal
Data master untuk mengatur jadwal ketersediaan dokter dan layanan tertentu, beserta batas kuota antrian.
Dt-4
Data Layanan
Id_Layanan,
Nama_Layanan,
Estimasi_Layanan,
Deskripsi_Layanan,
Harga,
Status
Data yang digunakan untuk menyimpan informasi pilihan layanan di klinik sense’s
Dt-5
Data Reservasi
No_Reservasi,
Tanggal_Reservasi,
Waktu_Mulai,
Waktu_Selesai,
Status_Reservasi,
Keluhan_Awal,
Alasan_Pembatalan
Data yang digunakan untuk menyimpan jadwal reservasi pasien
Dt-6
Data Pembayaran
Tanggal_Bayar
Total_Biaya
Metode_Pembayaran
Data yang digunakan untuk mencatat transaksi pembayaran pasien berdasarkan biaya layanan yang diterima di klinik.



Tabel Resepsionis
Nama file : akun.sql Tempat penyimpanan: Harddisk

Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Id_Resepsionis
Integer
11
Primary Key
ID unik untuk autentikasi pengguna.
Nama_Lengkap
Varchar
50
-
Nama lengkap dari resepsionis. 
Telepon
Varchar
20
-
Nomor kontak/telepon pengguna.
Password
Varchar
255
-
Kata sandi resepsionis untuk login ke sistem. 




Tabel Pasien
Nama file : pasien.sql Tempat penyimpanan: Harddisk

Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Email
Varchar
100
Primary Key
Email pasien untuk login ke sistem. 
Jenis_Kelamin
Varchar
15
-
Jenis kelamin pasien.
Password
Varchar
255
-
Kata sandi pasien untuk login ke sistem
Tempat_Lahir
Varchar
50
-
Kota kelahiran pasien.
Tanggal_Lahir
Date
-
-
Tanggal lahir pasien.
Pendidikan_Terakhir
Varchar
50
-
Pendidikan terakhir pasien.
Pekerjaan
Varchar
50
-
Pekerjaan saat ini dari pasien.
Status
Varchar
20
-
Status pernikahan pasien.
Agama
Varchar
20
-
Agama pasien.
Alamat_Domisili
Varchar
255
-
Alamat tempat tinggal pasien saat ini.
Kota
Varchar
50
-
Kota domisili pasien.



Tabel Layanan
Nama file : layanan.sql  Tempat penyimpanan: Harddisk

Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Id_Layanan
Integer
11
Primary Key
ID unik untuk jenis layanan/tindakan.
Nama_Layanan
Varchar
100
-
Nama paket pengobatan atau tindakan medis.
Estimasi_Layanan
Varchar
50
-
Perkiraan waktu penyelesaian layanan.
Deskripsi_Layanan
Varchar
255
-
Penjelasan rinci mengenai jenis layanan.
Harga
Decimal
10,2
-
Harga dasar untuk layanan 
tersebut.
status
Varchar
20
-
Status layanan, misalnya Aktif atau Tidak Aktif



Tabel Jadwal
Nama file : jadwal.sql Tempat penyimpanan: Harddisk
Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Id_Jadwal
Integer
11
Primary Key
ID unik untuk jadwal operasional.
Tanggal
Date
-
-
Hari praktik (Senin, Selasa, dll).
Jam_Mulai
Time
-
-
Waktu dimulainya praktik dokter.
Jam_Selesai
Time
-
-
Waktu berakhirnya praktik dokter.


Tabel Reservasi
Nama file : booking.sql Tempat penyimpanan: Harddisk

Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Id_Reservasi
Integer
11
Primary Key
ID unik untuk transaksi reservasi/booking.
Email_pasien
Integer
255
Foreign Key
Kunci tamu dari tabel Pasien.
Id_Layanan
Integer
11
Foreign Key


Id_Jadwal
Integer
11
Foreign Key
Kunci tamu dari tabel Jadwal.
Id_Resepsionis
Integer
11
Foreign Key


Tanggal_Reservasi
Date
-
-
Tanggal kedatangan yang direservasi pasien.
Status_Reservasi
Varchar
20
-
Status reservasi (misal: Menunggu, Selesai).
Keluhan_Awal
Varchar
255
-
Keluhan awal yang diisi pasien saat reservasi
Alasan_Pembatalan
Varchar
255
-
Alasan pembatalan jika reservasi dibatalkan



Tabel Pembayaran
Nama file : pembayaran.sql Tempat penyimpanan: Harddisk

Nama Field
Tipe Data
Panjang
Kunci
Keterangan
Id_Pembayaran
Varchar
20
Primary Key
ID unik untuk transaksi pembayaran
No_Reservasi
Varchar
11
Foreign Key
Kunci tamu dari tabel Reservasi
Tanggal_Bayar
Datetime
-
-
Tanggal dan Waktu terjadinya pembayaran.
Total_Biaya
Decimal
10,2
-
Total biaya yang harus dibayar pasien.
Metode_Pembayaran
Varchar
50
-
Metode pelunasan tagihan.

