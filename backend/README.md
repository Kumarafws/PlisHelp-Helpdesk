# PlisHelp IT Helpdesk - Backend API (Laravel 13 + PostgreSQL + Eloquent ORM)

Backend RESTful API untuk sistem manajemen tiket **PlisHelp Helpdesk**. Dibangun dengan **Laravel 13**, **PostgreSQL 15+**, dan **Eloquent ORM**.

---

## 📋 Fitur Utama Backend

- 🔐 **Autentikasi API**: Laravel Sanctum v4 dengan Multi-Role Authorization (`Employee`, `IT Support`, `Admin`).
- 🐘 **Database PostgreSQL 15+**:
  - Kolom **`jsonb`** untuk audit trail / timeline activities metadata (didukung GIN Index).
  - Tipe **`timestamptz`** untuk ketepatan zona waktu SLA (`Asia/Jakarta`).
  - Relasi integritas referensial penuh dengan *foreign key cascades* dan *soft deletes*.
- ⚡ **Eloquent ORM**:
  - Model casting modern Laravel 13 (`casts(): array`).
  - Query scopes siap pakai (`scopeForUser`, `scopeStatus`, `scopePriority`, `scopeBreached`, `scopeSearch`).
  - Dynamic computed SLA remaining accessors.
- 🎯 **SLA Engine & State Machine**:
  - Pengelolaan otomatis status tiket (`OPEN` ➔ `IN_PROGRESS` ➔ `NEED_INFO` ➔ `RESOLVED` ➔ `CLOSED` / `ESCALATED`).
  - Pause & Resume SLA timer saat status `NEED_INFO`.
  - Notifikasi terpusat untuk setiap perubahan alur kerja.

---

## 🛠️ Persyaratan Sistem

- **PHP**: `^8.2`, `^8.3`, atau `^8.4` (Ekstensi: `pdo_pgsql`, `pgsql`, `mbstring`, `openssl`, `curl`)
- **Composer**: `^2.6+`
- **PostgreSQL**: `^15.0+`

---

## 🚀 Panduan Instalasi & Menjalankan Backend

### 1. Salin Berkas Konfigurasi Environment
```bash
cd backend
cp .env.example .env
```

### 2. Atur Koneksi PostgreSQL pada `.env`
Buka berkas `.env` dan sesuaikan kredensial database Anda:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=plishelp_db
DB_USERNAME=postgres
DB_PASSWORD=password_postgresql_anda
DB_SCHEMA=public
```

> **Catatan**: Pastikan database `plishelp_db` sudah dibuat di PostgreSQL Anda (`CREATE DATABASE plishelp_db;`).

### 3. Install Dependensi Composer
```bash
composer install
php artisan key:generate
```

### 4. Jalankan Migrasi & Database Seeder
Jalankan perintah Artisan untuk membuat seluruh tabel dan mengisi data awal demo:
```bash
php artisan migrate --seed
```

> **Opsi Eksekusi SQL Langsung (Opsional)**:  
> Jika Anda ingin membuat tabel langsung tanpa artisan migration, Anda dapat mengeksekusi berkas `database/schema_postgresql.sql` melalui **pgAdmin** atau terminal:
> ```bash
> psql -U postgres -d plishelp_db -f database/schema_postgresql.sql
> ```

### 5. Jalankan Server Lokal API
```bash
php artisan serve --port=8000
```
Server API backend akan aktif di: `http://localhost:8000/api/v1`

---

## 🔑 Akun Demo Bawaan (Hasil Seeder)

| Role | Nama | Email | Password | Departemen |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | Andi Pratama | `andi@plishelp.co.id` | `password123` | Marketing & Communications |
| **Employee** | Clara Wijaya | `clara@plishelp.co.id` | `password123` | Finance & Accounting |
| **IT Support** | Budi Santoso | `budi@plishelp.co.id` | `password123` | IT Operations & Helpdesk |
| **IT Support** | Dimas Saputra | `dimas@plishelp.co.id` | `password123` | IT Operations & Helpdesk |
| **Admin** | Admin PlisHelp | `admin@plishelp.co.id` | `password123` | IT Operations & Helpdesk |

---

## 📑 Daftar Endpoint RESTful API (`/api/v1`)

### 1. Autentikasi (`/auth`)
- `POST /auth/login` - Login pengguna, menghasilkan token Bearer Sanctum.
- `GET /auth/me` - Mengambil profil user yang sedang login `[Auth]`.
- `POST /auth/logout` - Menghapus sesi / token `[Auth]`.

### 2. Dashboard (`/dashboard`)
- `GET /dashboard/summary` - Mengambil ringkasan data metrik & kartu KPI sesuai role `[Auth]`.

### 3. Tiket & Alur Penanganan (`/tickets`)
- `GET /tickets` - Mengambil daftar tiket (filter: `status`, `priority`, `category_id`, `q`, `page`) `[Auth]`.
- `POST /tickets` - Membuat tiket baru `[Auth: Employee/Admin]`.
- `GET /tickets/{id}` - Mengambil detail lengkap tiket beserta komentar, timeline, & attachment `[Auth]`.
- `POST /tickets/{id}/take` - Mengklaim tiket (*Take Ticket*) `[Auth: IT Support]`.
- `POST /tickets/{id}/assign` - Menugaskan / mengalihkan tiket `[Auth: Admin]`.
- `POST /tickets/{id}/override-status` - Override status administratif `[Auth: Admin]`.
- `POST /tickets/{id}/request-info` - Meminta informasi tambahan (Need Info) `[Auth: IT Support]`.
- `POST /tickets/{id}/resolve` - Menyelesaikan tiket (Resolved) `[Auth: IT Support]`.
- `POST /tickets/{id}/escalate` - Mengeskalasi tiket `[Auth: IT Support]`.
- `POST /tickets/{id}/close` - Menutup tiket secara resmi `[Auth: Employee]`.
- `POST /tickets/{id}/reopen` - Membuka kembali tiket yang telah resolved `[Auth: Employee]`.
- `POST /tickets/{id}/rating` - Memberikan ulasan bintang (1-5) & feedback `[Auth: Employee]`.
- `POST /tickets/{id}/comments` - Mengirim balasan publik atau *internal note* `[Auth]`.

### 4. Manajemen Pengguna (`/users`) `[Admin Only]`
- `GET /users` - Mengambil daftar pengguna sistem.
- `POST /users` - Membuat akun pengguna baru.
- `PUT /users/{id}` - Memperbarui data pengguna.
- `PATCH /users/{id}/toggle-status` - Mengaktifkan / menonaktifkan status akun pengguna.

### 5. Master Data (`/departments`, `/categories`, `/sla-policies`)
- `GET /departments` - Daftar departemen.
- `POST /departments` - Simpan departemen.
- `PATCH /departments/{id}/toggle-status` - Toggle status departemen.
- `GET /categories` - Daftar kategori & subkategori.
- `POST /categories` - Simpan kategori & sinkronisasi subkategori.
- `PATCH /categories/{id}/toggle-status` - Toggle status kategori.
- `GET /sla-policies` - Daftar target SLA.
- `POST /sla-policies` - Simpan / perbarui konfigurasi SLA global.

### 6. Notifikasi (`/notifications`)
- `GET /notifications` - Daftar notifikasi user yang login.
- `PATCH /notifications/{id}/read` - Tandai 1 notifikasi sebagai dibaca.
- `POST /notifications/mark-all-read` - Tandai semua notifikasi dibaca.

---

## 📊 Kueri Lanjutan PostgreSQL

Lihat berkas [`database/queries_postgresql.sql`](file:///e:/Sistem%20Helpdesk/backend/database/queries_postgresql.sql) untuk kueri SQL siap pakai seperti:
- Kueri pelacakan SLA Breach dan countdown waktu.
- Kueri kalkulasi KPI performa teknisi IT Support.
- Kueri agregasi tiket per departemen dan kategori.
- Kueri pencarian teks penuh (*Full-Text Search*).
