<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\TicketComment;
use App\Models\TicketActivity;
use App\Models\TicketRating;
use Carbon\Carbon;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $andi = User::where('email', 'andi@plishelp.co.id')->first();
        $clara = User::where('email', 'clara@plishelp.co.id')->first();
        $budi = User::where('email', 'budi@plishelp.co.id')->first();
        $dimas = User::where('email', 'dimas@plishelp.co.id')->first();
        $admin = User::where('email', 'admin@plishelp.co.id')->first();

        $catNet = Category::where('name', 'Network & Connectivity')->first();
        $catHw = Category::where('name', 'Hardware & Devices')->first();
        $catSw = Category::where('name', 'Software & Application')->first();
        $catAcc = Category::where('name', 'Access & Accounts')->first();

        $deptMktg = Department::where('code', 'MKTG')->first();
        $deptFin = Department::where('code', 'FIN')->first();

        // -------------------------------------------------------------
        // Ticket 1: NEED_INFO (Wi-Fi issue)
        // -------------------------------------------------------------
        if ($andi && $budi && $catNet && $deptMktg) {
            $t1 = Ticket::updateOrCreate(
                ['number' => 'PH-20260825-0005'],
                [
                    'title' => 'Laptop sering terputus dari Wi-Fi kantor saat meeting',
                    'description' => 'Koneksi Wi-Fi kantor di Ruang Meeting Arjuna Lt. 3 sering terputus mendadak setiap 10-15 menit saat presentasi video call dengan klien.',
                    'type' => 'Incident',
                    'category_id' => $catNet->id,
                    'subcategory_name' => 'Wi-Fi Kantor',
                    'priority' => 'HIGH',
                    'status' => 'NEED_INFO',
                    'requester_id' => $andi->id,
                    'assignee_id' => $budi->id,
                    'department_id' => $deptMktg->id,
                    'sla_due_at' => Carbon::now()->addHours(8),
                    'first_response_at' => Carbon::now()->subHours(2),
                    'sla_response_minutes' => 30,
                    'sla_resolution_hours' => 4,
                    'sla_status' => 'PAUSED',
                ]
            );

            TicketComment::updateOrCreate(
                ['ticket_id' => $t1->id, 'body' => 'Bisa tolong infokan MAC Address Wi-Fi laptop Anda dan apakah rekan lain mengalami hal yang sama di ruang meeting tersebut?'],
                [
                    'user_id' => $budi->id,
                    'author_name' => $budi->name,
                    'author_role' => $budi->role,
                    'is_internal' => false,
                ]
            );

            TicketActivity::updateOrCreate(
                ['ticket_id' => $t1->id, 'action' => 'Status Changed to NEED_INFO'],
                [
                    'user_id' => $budi->id,
                    'actor_name' => $budi->name,
                    'actor_role' => $budi->role,
                    'note' => 'Meminta detail MAC Address laptop dan lokasi spesifik access point.',
                ]
            );
        }

        // -------------------------------------------------------------
        // Ticket 2: IN_PROGRESS (Monitor Issue)
        // -------------------------------------------------------------
        if ($clara && $dimas && $catHw && $deptFin) {
            $t2 = Ticket::updateOrCreate(
                ['number' => 'PH-20260825-0006'],
                [
                    'title' => 'Monitor eksternal Dell 27 inch berkedip hitam intermiten',
                    'description' => 'Monitor tambahan di meja kerja Finance tiba-tiba mati sekejap lalu menyala kembali saat membuka software akuntansi SAP.',
                    'type' => 'Incident',
                    'category_id' => $catHw->id,
                    'subcategory_name' => 'Monitor Eksternal',
                    'priority' => 'MEDIUM',
                    'status' => 'IN_PROGRESS',
                    'requester_id' => $clara->id,
                    'assignee_id' => $dimas->id,
                    'department_id' => $deptFin->id,
                    'sla_due_at' => Carbon::now()->addHours(5),
                    'first_response_at' => Carbon::now()->subHour(),
                    'sla_response_minutes' => 60,
                    'sla_resolution_hours' => 12,
                    'sla_status' => 'WITHIN_SLA',
                ]
            );

            TicketActivity::updateOrCreate(
                ['ticket_id' => $t2->id, 'action' => 'Ticket Assigned / Taken'],
                [
                    'user_id' => $dimas->id,
                    'actor_name' => $dimas->name,
                    'actor_role' => $dimas->role,
                    'note' => 'Teknisi sedang menyiapkan kabel pengganti USB-C ke DisplayPort.',
                ]
            );
        }

        // -------------------------------------------------------------
        // Ticket 3: OPEN (Unassigned VPN access)
        // -------------------------------------------------------------
        if ($andi && $catNet && $deptMktg) {
            $t3 = Ticket::updateOrCreate(
                ['number' => 'PH-20260826-0001'],
                [
                    'title' => 'Permintaan Akses VPN Perusahaan untuk Perjalanan Dinas Luar Kota',
                    'description' => 'Mohon dibuatkan akun dan profil VPN untuk akses database marketing selama penugasan pameran di Surabaya tanggal 2-5 September 2026.',
                    'type' => 'Request',
                    'category_id' => $catNet->id,
                    'subcategory_name' => 'VPN & Remote Access',
                    'priority' => 'MEDIUM',
                    'status' => 'OPEN',
                    'requester_id' => $andi->id,
                    'assignee_id' => null,
                    'department_id' => $deptMktg->id,
                    'sla_due_at' => Carbon::now()->addHours(11),
                    'sla_response_minutes' => 60,
                    'sla_resolution_hours' => 12,
                    'sla_status' => 'WITHIN_SLA',
                ]
            );

            TicketActivity::updateOrCreate(
                ['ticket_id' => $t3->id, 'action' => 'Ticket Created'],
                [
                    'user_id' => $andi->id,
                    'actor_name' => $andi->name,
                    'actor_role' => $andi->role,
                    'note' => 'Tiket masuk antrean sistem helpdesk.',
                ]
            );
        }

        // -------------------------------------------------------------
        // Ticket 4: RESOLVED (Adobe Creative Cloud)
        // -------------------------------------------------------------
        if ($andi && $budi && $catSw && $deptMktg) {
            $t4 = Ticket::updateOrCreate(
                ['number' => 'PH-20260824-0002'],
                [
                    'title' => 'Aktivasi Lisensi Adobe Photoshop & Illustrator Tim Desain',
                    'description' => 'Lisensi Adobe Creative Cloud muncul pesan subscription expired saat membuka file campaign billboard.',
                    'type' => 'Request',
                    'category_id' => $catSw->id,
                    'subcategory_name' => 'Adobe Creative Cloud',
                    'priority' => 'HIGH',
                    'status' => 'RESOLVED',
                    'requester_id' => $andi->id,
                    'assignee_id' => $budi->id,
                    'department_id' => $deptMktg->id,
                    'sla_due_at' => Carbon::now()->subHours(2),
                    'first_response_at' => Carbon::now()->subHours(8),
                    'resolved_at' => Carbon::now()->subHours(1),
                    'sla_response_minutes' => 30,
                    'sla_resolution_hours' => 4,
                    'sla_status' => 'WITHIN_SLA',
                    'resolution_summary' => 'Lisensi Adobe Enterprise telah diperbarui pada portal Admin Console dan akun andi@plishelp.co.id telah di-reassign ke seat aktif.',
                ]
            );

            TicketActivity::updateOrCreate(
                ['ticket_id' => $t4->id, 'action' => 'Ticket Resolved'],
                [
                    'user_id' => $budi->id,
                    'actor_name' => $budi->name,
                    'actor_role' => $budi->role,
                    'note' => 'Lisensi Enterprise aktif kembali.',
                ]
            );
        }

        // -------------------------------------------------------------
        // Ticket 5: CLOSED with Rating
        // -------------------------------------------------------------
        if ($clara && $budi && $catAcc && $deptFin) {
            $t5 = Ticket::updateOrCreate(
                ['number' => 'PH-20260820-0010'],
                [
                    'title' => 'Reset Password Akun Portal Payroll dan HRIS',
                    'description' => 'Akun terkunci karena salah input password 3 kali berturut-turut.',
                    'type' => 'Request',
                    'category_id' => $catAcc->id,
                    'subcategory_name' => 'Portal HR / Payroll',
                    'priority' => 'LOW',
                    'status' => 'CLOSED',
                    'requester_id' => $clara->id,
                    'assignee_id' => $budi->id,
                    'department_id' => $deptFin->id,
                    'sla_due_at' => Carbon::now()->subDays(4),
                    'first_response_at' => Carbon::now()->subDays(5),
                    'resolved_at' => Carbon::now()->subDays(4),
                    'closed_at' => Carbon::now()->subDays(4),
                    'sla_response_minutes' => 120,
                    'sla_resolution_hours' => 48,
                    'sla_status' => 'WITHIN_SLA',
                    'resolution_summary' => 'Akun telah di-unlock dan temporary password dikirimkan via SMS resmi IT.',
                ]
            );

            TicketRating::updateOrCreate(
                ['ticket_id' => $t5->id],
                [
                    'user_id' => $clara->id,
                    'score' => 5,
                    'feedback' => 'Sangat cepat dan solutif. Terima kasih tim IT!',
                ]
            );
        }
    }
}
