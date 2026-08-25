# PRD --- PlisHelp

**Product:** PlisHelp\
**Version:** 1.0\
**Product Type:** Internal IT Helpdesk Management System\
**Status:** Draft / Baseline\
**Primary Users:** Employee, IT Support, IT Admin/Manager

------------------------------------------------------------------------

## 1. Product Overview

**PlisHelp** adalah aplikasi internal perusahaan yang digunakan untuk
mengelola laporan masalah dan permintaan bantuan IT secara terpusat.

Karyawan dapat membuat ticket ketika mengalami masalah atau membutuhkan
layanan IT. Ticket kemudian diproses oleh IT Support melalui proses
assignment, investigation, communication, resolution, hingga akhirnya
dikonfirmasi dan ditutup oleh karyawan.

PlisHelp bertujuan menggantikan proses pelaporan yang sebelumnya
tersebar melalui WhatsApp, email, telepon, atau komunikasi langsung
dengan sistem terstruktur yang dapat dilacak dan terdokumentasi.

### Core Workflow

``` text
Employee
   |
   | Create Ticket
   v
OPEN
   |
   | Assignment
   v
ASSIGNED
   |
   v
IN_PROGRESS
   |
   +--------------------> NEED_INFO
   |                         |
   |                         +----> IN_PROGRESS
   |
   +--------------------> ESCALATED
   |
   v
RESOLVED
   |
   | Employee confirms
   v
CLOSED
```

------------------------------------------------------------------------

## 2. Background

Dalam lingkungan perusahaan, berbagai permasalahan IT dapat terjadi
setiap hari, mulai dari masalah perangkat keras, jaringan, aplikasi,
akun, akses sistem, hingga permintaan instalasi software.

Apabila laporan tersebut dilakukan melalui berbagai saluran komunikasi
seperti WhatsApp, email, telepon, atau komunikasi secara langsung,
proses pengelolaan ticket menjadi sulit dilakukan secara terstruktur.

Beberapa permasalahan yang dapat muncul:

1.  Laporan dapat terlewat.
2.  Tidak terdapat satu sumber data mengenai seluruh masalah IT.
3.  Karyawan tidak mengetahui perkembangan laporan.
4.  Sulit mengetahui siapa yang bertanggung jawab terhadap suatu
    masalah.
5.  Prioritas penanganan tidak terstruktur.
6.  Riwayat troubleshooting tidak terdokumentasi.
7.  Manajemen sulit mengukur performa tim IT.
8.  Waktu penyelesaian sulit diukur.
9.  Sulit mengetahui pola permasalahan IT yang paling sering terjadi.

PlisHelp dibuat untuk menyediakan satu platform terpusat yang mengelola
seluruh proses tersebut.

------------------------------------------------------------------------

## 3. Problem Statement

### Problem Utama

> Perusahaan membutuhkan mekanisme terpusat untuk mencatat, mengelola,
> memprioritaskan, memantau, dan menyelesaikan masalah serta permintaan
> IT secara terstruktur.

### Problem untuk Employee

Employee tidak memiliki cara yang terstruktur untuk:

-   melaporkan masalah,
-   melihat status laporan,
-   mengetahui siapa yang menangani,
-   memberikan informasi tambahan,
-   mengetahui apakah masalah sudah selesai.

### Problem untuk IT Support

IT Support kesulitan:

-   mengelola banyak laporan,
-   menentukan prioritas,
-   mengetahui ticket yang harus dikerjakan,
-   mendokumentasikan troubleshooting,
-   mengetahui ticket yang melewati SLA.

### Problem untuk IT Manager/Admin

Manajemen kesulitan:

-   memantau workload,
-   mengetahui performa support,
-   mengetahui jumlah ticket,
-   mengukur waktu penyelesaian,
-   mengetahui pola permasalahan IT.

------------------------------------------------------------------------

## 4. Product Goals

### Primary Goal

Menyediakan sistem terpusat untuk mengelola IT support request dari awal
hingga selesai.

### Secondary Goals

PlisHelp harus mampu:

1.  Mempermudah Employee membuat laporan.
2.  Memberikan transparansi status ticket.
3.  Membantu Support mengorganisasi pekerjaan.
4.  Memastikan setiap ticket memiliki penanggung jawab.
5.  Menyimpan histori aktivitas ticket.
6.  Mengukur waktu response dan resolution.
7.  Membantu Admin/Manager memonitor performa helpdesk.

------------------------------------------------------------------------

## 5. Non-Goals

Untuk menjaga scope MVP, PlisHelp tidak mencakup:

-   Mobile application.
-   WhatsApp integration.
-   AI chatbot.
-   Payment system.
-   Customer-facing support.
-   Multi-company management.
-   Advanced AI ticket classification.
-   Knowledge Base pada MVP.
-   Real-time chat pada MVP.
-   Complex IT asset management.
-   Full project management.

Fitur tersebut dapat dipertimbangkan untuk versi selanjutnya.

------------------------------------------------------------------------

## 6. Target Users

### 6.1 Employee

Karyawan perusahaan yang membutuhkan bantuan IT.

Contoh:

-   Finance
-   HR
-   Marketing
-   Sales
-   Operations

**Primary need:**

> Saya ingin melaporkan masalah IT dengan mudah dan mengetahui
> perkembangannya.

### 6.2 IT Support

Tim yang bertanggung jawab menyelesaikan masalah.

**Primary need:**

> Saya ingin mengetahui ticket yang harus saya tangani dan memiliki
> informasi lengkap untuk menyelesaikannya.

### 6.3 IT Admin / IT Manager

Pengelola sistem dan supervisor tim IT.

**Primary need:**

> Saya ingin mengetahui kondisi seluruh ticket dan performa tim IT.

------------------------------------------------------------------------

## 7. Role & Permission

  Capability               Employee   IT Support   Admin
  ----------------------- ---------- ------------ -------
  Login                       ✓           ✓          ✓
  Create Ticket               ✓           ✓          ✓
  View Own Ticket             ✓           ✓          ✓
  View All Tickets            \-          ✓          ✓
  Assign Ticket               \-          \-         ✓
  Take Ticket                 \-          ✓          ✓
  Update Ticket Status     Limited        ✓          ✓
  Change Priority             \-          ✓          ✓
  Add Public Comment          ✓           ✓          ✓
  Add Internal Note           \-          ✓          ✓
  Upload Attachment           ✓           ✓          ✓
  Resolve Ticket              \-          ✓          ✓
  Close Ticket                ✓           \-         ✓
  Reopen Ticket               ✓           ✓          ✓
  User Management             \-          \-         ✓
  Category Management         \-          \-         ✓
  Department Management       \-          \-         ✓
  View Reports                \-       Limited       ✓
  View Dashboard             Own         Team       All

Detail permission akan ditentukan lebih lanjut pada fase authorization
design.

------------------------------------------------------------------------

## 8. Ticket Types

PlisHelp membedakan dua jenis ticket.

### 8.1 Incident

Masalah atau gangguan yang terjadi pada layanan IT.

Contoh:

-   Wi-Fi tidak bekerja.
-   Laptop tidak menyala.
-   Tidak bisa login.
-   Printer rusak.
-   Aplikasi error.

### 8.2 Service Request

Permintaan layanan IT.

Contoh:

-   Request instalasi software.
-   Request akses aplikasi.
-   Request akun.
-   Request konfigurasi perangkat.

------------------------------------------------------------------------

## 9. Ticket Category

Kategori awal:

``` text
Hardware
Software
Network
Account & Access
Email
Printer
System/Application
Other
```

Kategori dapat memiliki subcategory.

Contoh:

``` text
Network
├── Wi-Fi
├── LAN
└── VPN

Hardware
├── Laptop
├── Desktop
├── Monitor
└── Printer
```

Admin dapat mengelola category dan subcategory.

------------------------------------------------------------------------

## 10. Priority

PlisHelp menggunakan empat level prioritas.

  Priority   Description
  ---------- -------------------------------------------------------
  Low        Tidak menghambat pekerjaan utama
  Medium     Mengganggu pekerjaan tetapi masih terdapat workaround
  High       Menghambat pekerjaan penting
  Urgent     Berdampak besar terhadap operasional

Contoh:

-   **Low:** Request instalasi aplikasi tambahan.
-   **Medium:** Printer satu pengguna tidak bekerja.
-   **High:** Employee tidak dapat mengakses sistem utama perusahaan.
-   **Urgent:** Server utama perusahaan mengalami downtime.

------------------------------------------------------------------------

## 11. Ticket Status

Status utama:

``` text
OPEN
ASSIGNED
IN_PROGRESS
NEED_INFO
ESCALATED
RESOLVED
CLOSED
```

### OPEN

Ticket baru dibuat dan belum ditugaskan.

### ASSIGNED

Ticket sudah memiliki technician.

### IN_PROGRESS

Ticket sedang ditangani.

### NEED_INFO

Support membutuhkan informasi tambahan dari Employee.

### ESCALATED

Ticket membutuhkan penanganan pihak atau level support yang lebih
tinggi.

### RESOLVED

Support menyatakan masalah sudah diselesaikan.

### CLOSED

Employee telah mengonfirmasi penyelesaian.

------------------------------------------------------------------------

## 12. Ticket Lifecycle

### Normal Flow

``` text
OPEN
 ↓
ASSIGNED
 ↓
IN_PROGRESS
 ↓
RESOLVED
 ↓
CLOSED
```

### Need Information

``` text
IN_PROGRESS
 ↓
NEED_INFO
 ↓
IN_PROGRESS
```

### Escalation

``` text
IN_PROGRESS
 ↓
ESCALATED
 ↓
IN_PROGRESS
```

### Reopen

``` text
CLOSED
 ↓
REOPENED*
 ↓
IN_PROGRESS
```

`REOPENED` dapat diimplementasikan sebagai event/transisi atau status
tersendiri. Keputusan final dibuat pada desain workflow.

------------------------------------------------------------------------

## 13. Ticket Information

Setiap ticket minimal memiliki:

``` text
Ticket Number
Title
Description
Type
Category
Subcategory
Priority
Status
Created By
Assigned To
Department
Created At
Updated At
Resolved At
Closed At
```

Contoh:

``` text
PH-20260825-0001

Title:
Laptop tidak dapat terhubung ke Wi-Fi

Type:
Incident

Category:
Network

Subcategory:
Wi-Fi

Priority:
High

Status:
In Progress

Created By:
Kumara - Finance

Assigned To:
Budi - IT Support
```

------------------------------------------------------------------------

## 14. Ticket Comment

Ticket dapat memiliki percakapan.

### Public Comment

Dapat dilihat oleh:

-   Employee
-   IT Support
-   Admin

### Internal Note

Hanya dapat dilihat oleh:

-   IT Support
-   Admin

Contoh public comment:

> Kami sedang melakukan pengecekan konfigurasi jaringan.

Contoh internal note:

> Kemungkinan masalah berasal dari access point lantai 2.

------------------------------------------------------------------------

## 15. Attachment

User dapat melampirkan file pada ticket.

Contoh:

``` text
error.png
screenshot.jpg
diagnostic.pdf
```

MVP perlu menentukan:

-   maximum file size,
-   allowed MIME types,
-   access control,
-   storage location.

Implementasi menggunakan Laravel Storage.

------------------------------------------------------------------------

## 16. Assignment

Ticket dapat ditugaskan oleh Admin kepada IT Support.

``` text
Ticket
   ↓
Admin
   ↓
Assign
   ↓
Budi - Network Support
```

Selain assignment manual, Support dapat mengambil ticket yang masih
belum ditugaskan melalui:

> **Take Ticket**

------------------------------------------------------------------------

## 17. SLA

Setiap priority memiliki target SLA.

  Priority     Response Target   Resolution Target
  ---------- ----------------- -------------------
  Urgent              15 menit               2 jam
  High                30 menit               4 jam
  Medium                 2 jam              1 hari
  Low                    4 jam              3 hari

Sistem mencatat:

``` text
created_at
first_response_at
resolved_at
closed_at
```

Kemudian sistem menghitung:

``` text
Response Time
Resolution Time
SLA Status
```

------------------------------------------------------------------------

## 18. SLA Business Rule

Ketika ticket berstatus `NEED_INFO`, waktu resolution SLA dapat
dihentikan sementara karena penyelesaian bergantung pada informasi dari
Employee.

Setelah Employee memberikan informasi, SLA kembali berjalan.

Detail perhitungan SLA akan ditentukan ketika membuat technical
specification.

------------------------------------------------------------------------

## 19. Notification

MVP menggunakan in-app notification.

### Ticket Created

Support/Admin mendapatkan notification.

### Ticket Assigned

Support mendapatkan notification.

### New Comment

User terkait mendapatkan notification.

### Ticket Resolved

Employee mendapatkan notification.

### Ticket Reopened

Support mendapatkan notification.

------------------------------------------------------------------------

## 20. Activity Log

Setiap aktivitas penting ticket dicatat.

Contoh:

``` text
09:20
Kumara created ticket.

09:35
Admin assigned ticket to Budi.

09:42
Budi changed status:
ASSIGNED → IN_PROGRESS

10:15
Budi added a comment.

11:10
Budi marked ticket as RESOLVED.

11:30
Kumara confirmed resolution.

11:30
Ticket CLOSED.
```

Activity log bersifat append-only dalam konsep bisnis.

------------------------------------------------------------------------

## 21. Employee Dashboard

Dashboard Employee menampilkan:

``` text
My Tickets

Open
In Progress
Need Info
Resolved
Closed
```

Informasi tambahan:

-   Recent tickets
-   Ticket yang membutuhkan tindakan
-   Notification
-   Quick Create Ticket

------------------------------------------------------------------------

## 22. Support Dashboard

Dashboard IT Support:

``` text
Assigned Tickets
In Progress
Need Information
Overdue
Resolved
```

Informasi tambahan:

-   ticket berdasarkan priority,
-   ticket berdasarkan category,
-   ticket yang mendekati SLA,
-   ticket yang sudah overdue.

------------------------------------------------------------------------

## 23. Admin Dashboard

Admin/Manager mendapatkan gambaran keseluruhan:

``` text
Total Tickets
Open
In Progress
Resolved
Closed
Overdue
```

Analytics:

-   Tickets by status
-   Tickets by category
-   Tickets by priority
-   Tickets by technician
-   Average response time
-   Average resolution time
-   SLA compliance

------------------------------------------------------------------------

## 24. Rating

Setelah ticket selesai, Employee dapat memberikan rating.

``` text
How satisfied are you?

★ ★ ★ ★ ★

Comment:
"Masalah diselesaikan dengan cepat."
```

Rating digunakan sebagai salah satu indikator kualitas layanan.

------------------------------------------------------------------------

## 25. User Management

Admin dapat:

-   melihat user,
-   membuat user,
-   mengubah user,
-   menonaktifkan user,
-   menentukan role,
-   menentukan department.

Contoh:

``` text
Kumara
Role       : Employee
Department : Finance
Status     : Active
```

------------------------------------------------------------------------

## 26. Department Management

Department awal:

``` text
IT
Finance
HR
Marketing
Sales
Operations
```

Admin dapat menambah atau mengubah department.

------------------------------------------------------------------------

## 27. Category Management

Admin dapat:

-   membuat category,
-   mengubah category,
-   menonaktifkan category,
-   membuat subcategory.

Category yang sudah digunakan oleh ticket tidak boleh dihapus secara
sembarangan; lebih aman menggunakan konsep inactive/archived.

------------------------------------------------------------------------

## 28. Search & Filtering

### Search

Berdasarkan:

-   Ticket number
-   Title
-   Description

### Filter

Berdasarkan:

-   Status
-   Priority
-   Type
-   Category
-   Assignee
-   Department
-   Date

### Sorting

Contoh:

``` text
Newest
Oldest
Priority
SLA deadline
```

------------------------------------------------------------------------

## 29. Pagination

Data ticket menggunakan pagination.

Contoh:

``` text
Showing 1–20 of 125 tickets
```

Pagination dilakukan melalui API Laravel, bukan mengambil seluruh data
ke browser.

------------------------------------------------------------------------

## 30. Non-Functional Requirements

### Performance

API harus mampu menangani operasi CRUD dan filtering ticket secara
efisien.

### Security

Sistem harus:

-   menggunakan authentication,
-   menggunakan authorization,
-   melakukan server-side validation,
-   membatasi akses ticket,
-   memvalidasi file upload,
-   tidak mengekspos informasi sensitif.

### Maintainability

Code harus:

-   modular,
-   memiliki separation of concerns,
-   memiliki naming convention yang konsisten,
-   menggunakan reusable component.

### Scalability

Arsitektur harus memungkinkan penambahan:

-   email notification,
-   real-time notification,
-   knowledge base,
-   advanced reporting.

------------------------------------------------------------------------

## 31. Technology Stack

### Frontend

``` text
React
TypeScript
Vite
React Router
Material UI (MUI)
TanStack Query
Zustand
Axios
React Hook Form
Zod
Recharts
```

### Backend

``` text
Laravel
PHP
REST API
Laravel Sanctum
Eloquent ORM
Policies
Gates
Middleware
```

### Database

``` text
PostgreSQL
```

### Storage

``` text
Laravel Storage
```

### Testing

``` text
Pest
Vitest
React Testing Library
```

### Documentation

``` text
OpenAPI / Swagger
```

### Code Quality

``` text
ESLint
Prettier
Laravel Pint
PHPStan / Larastan
```

### Version Control

``` text
Git
GitHub
```

------------------------------------------------------------------------

## 32. System Architecture

``` text
                     ┌──────────────────┐
                     │      Employee    │
                     ├──────────────────┤
                     │   IT Support     │
                     ├──────────────────┤
                     │      Admin       │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │      React       │
                     │    TypeScript    │
                     │      Vite        │
                     │       MUI        │
                     └────────┬─────────┘
                              │
                         REST API
                              │
                              ▼
                     ┌──────────────────┐
                     │     Laravel      │
                     │   Sanctum/Auth   │
                     │   Controllers    │
                     │    Policies      │
                     │    Services      │
                     │    Eloquent      │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │    PostgreSQL    │
                     └──────────────────┘
```

------------------------------------------------------------------------

## 33. MVP Scope

### Authentication

-   Login
-   Logout
-   Profile
-   Role authorization

### Employee

-   Dashboard
-   Create ticket
-   View own tickets
-   Ticket detail
-   Comment
-   Attachment
-   Close ticket
-   Reopen ticket
-   Rating

### IT Support

-   Dashboard
-   Ticket queue
-   Search
-   Filter
-   Assignment
-   Take ticket
-   Status update
-   Priority update
-   Comment
-   Internal note
-   Resolution

### Admin

-   Dashboard
-   User management
-   Department management
-   Category management
-   Ticket management
-   Assignment
-   Basic reporting

### System

-   Notification
-   Activity log
-   SLA calculation

------------------------------------------------------------------------

## 34. Future Roadmap

### Version 1.1

-   Email notification
-   Advanced filtering
-   Better reporting
-   SLA escalation

### Version 1.2

-   Knowledge Base
-   FAQ
-   Article search
-   Suggested solutions

### Version 2.0

-   Real-time notification
-   WebSocket
-   Advanced analytics
-   Technician performance
-   Advanced SLA management

### Future Exploration

-   AI ticket classification
-   AI suggested solution
-   Automatic ticket categorization
-   Integration dengan Microsoft Teams/Slack/WhatsApp

------------------------------------------------------------------------

## 35. Success Metrics

### Ticket Resolution Rate

Persentase ticket yang berhasil diselesaikan.

### Average Resolution Time

Rata-rata waktu dari ticket dibuat sampai resolved.

### First Response Time

Waktu rata-rata dari ticket dibuat sampai mendapatkan response pertama.

### SLA Compliance

Persentase ticket yang diselesaikan sesuai SLA.

### Customer Satisfaction

Rata-rata rating yang diberikan Employee.

------------------------------------------------------------------------

## 36. User Stories

### Employee

> Sebagai Employee, saya ingin membuat ticket agar saya dapat melaporkan
> masalah IT tanpa harus menghubungi support secara langsung.

> Sebagai Employee, saya ingin melihat status ticket agar saya
> mengetahui perkembangan masalah yang saya laporkan.

> Sebagai Employee, saya ingin memberikan informasi tambahan agar
> Support memiliki informasi yang cukup untuk menyelesaikan masalah.

### IT Support

> Sebagai IT Support, saya ingin melihat daftar ticket yang ditugaskan
> kepada saya agar saya mengetahui pekerjaan yang harus diselesaikan.

> Sebagai IT Support, saya ingin mengubah status ticket agar Employee
> mengetahui perkembangan penanganan.

> Sebagai IT Support, saya ingin menambahkan internal note agar saya
> dapat mencatat informasi troubleshooting yang tidak perlu diketahui
> Employee.

### Admin

> Sebagai Admin, saya ingin mengassign ticket kepada Support agar setiap
> ticket memiliki penanggung jawab.

> Sebagai IT Manager, saya ingin melihat statistik ticket agar saya
> dapat memonitor performa layanan IT.

------------------------------------------------------------------------

## 37. Feature Priorities

  Feature             Priority
  ------------------- -------------
  Login               Must Have
  Create Ticket       Must Have
  Ticket Management   Must Have
  Assignment          Must Have
  Status Workflow     Must Have
  Comment             Must Have
  Authorization       Must Have
  Dashboard           Must Have
  Attachment          Should Have
  Notification        Should Have
  Activity Log        Should Have
  SLA                 Should Have
  Rating              Could Have
  Knowledge Base      Future
  Real-time           Future
  AI                  Future

------------------------------------------------------------------------

## 38. Product Principles

### Centralized

Semua IT request berada di satu sistem.

### Transparent

Employee dapat mengetahui status ticket.

### Accountable

Setiap ticket memiliki penanggung jawab.

### Traceable

Setiap perubahan penting memiliki histori.

### Measurable

Performance dapat diukur melalui SLA dan analytics.

### Maintainable

Sistem dirancang dengan arsitektur yang mudah dikembangkan.

------------------------------------------------------------------------

## 39. Definition of Done --- MVP

MVP PlisHelp dianggap selesai apabila:

-   Employee dapat login.
-   Employee dapat membuat ticket.
-   Ticket mendapatkan nomor unik.
-   Admin dapat melihat ticket.
-   Admin dapat melakukan assignment.
-   Support dapat menangani ticket.
-   Support dapat memberikan komentar.
-   Support dapat memberikan internal note.
-   Status ticket mengikuti workflow yang valid.
-   Employee dapat melihat progress.
-   Support dapat menyelesaikan ticket.
-   Employee dapat melakukan konfirmasi.
-   Ticket dapat ditutup.
-   Aktivitas ticket tercatat.
-   Role & permission bekerja dengan benar.
-   Data tersimpan di PostgreSQL.
-   API terdokumentasi.
-   Backend memiliki automated tests untuk business logic utama.
-   Frontend dan backend dapat dijalankan secara terpisah.
-   Project dapat di-deploy.

------------------------------------------------------------------------

## 40. Development Sequence

Tahapan pengembangan yang direkomendasikan:

``` text
PRD
 ↓
Use Case Diagram
 ↓
Business Rules
 ↓
User Flow
 ↓
Activity Diagram
 ↓
Sequence Diagram
 ↓
ERD
 ↓
Database Schema
 ↓
API Contract
 ↓
UI/UX
 ↓
Backend Development
 ↓
Frontend Development
 ↓
Integration
 ↓
Testing
 ↓
Deployment
 ↓
Documentation
```

PRD ini merupakan baseline dan dapat diperbarui apabila ditemukan
requirement atau business rule baru pada tahap desain berikutnya.
