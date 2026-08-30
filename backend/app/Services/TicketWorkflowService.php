<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketActivity;
use App\Models\Notification;
use App\Models\TicketComment;
use App\Models\TicketRating;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TicketWorkflowService
{
    public function __construct(
        protected SlaService $slaService
    ) {}

    /**
     * Create a new Ticket
     */
    public function createTicket(array $data, User $requester): Ticket
    {
        return DB::transaction(function () use ($data, $requester) {
            $targets = $this->slaService->getPolicyTargets($data['priority'] ?? 'MEDIUM');
            $slaDueAt = $this->slaService->calculateSlaDueAt($data['priority'] ?? 'MEDIUM');

            $number = 'TKT-' . date('Ymd') . '-' . str_pad((string) (Ticket::count() + 1), 4, '0', STR_PAD_LEFT);

            $ticket = Ticket::create([
                'number' => $number,
                'title' => $data['title'],
                'description' => $data['description'],
                'type' => $data['type'] ?? 'Incident',
                'category_id' => $data['category_id'],
                'subcategory_id' => $data['subcategory_id'] ?? null,
                'subcategory_name' => $data['subcategory_name'] ?? null,
                'priority' => $data['priority'] ?? 'MEDIUM',
                'status' => 'OPEN',
                'requester_id' => $requester->id,
                'department_id' => $data['department_id'] ?? $requester->department_id,
                'sla_due_at' => $slaDueAt,
                'sla_response_minutes' => $targets['response_minutes'],
                'sla_resolution_hours' => $targets['resolution_hours'],
                'sla_status' => 'WITHIN_SLA',
            ]);

            // Audit Trail
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $requester->id,
                'action' => 'Ticket Created',
                'actor_name' => $requester->name,
                'actor_role' => $requester->role,
                'note' => 'Tiket berhasil dibuat dan masuk ke antrean IT Support.',
                'metadata' => [
                    'priority' => $ticket->priority,
                    'type' => $ticket->type,
                ],
            ]);

            // Notification
            Notification::create([
                'user_id' => $requester->id,
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->number,
                'type' => 'status_change',
                'title' => 'Tiket Berhasil Dibuat',
                'message' => "Tiket {$ticket->number} telah masuk ke sistem helpdesk.",
            ]);

            return $ticket;
        });
    }

    /**
     * IT Support takes an available ticket
     */
    public function takeTicket(Ticket $ticket, User $supportUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $supportUser) {
            $ticket->lockForUpdate();

            $now = Carbon::now();
            $ticket->update([
                'status' => 'IN_PROGRESS',
                'assignee_id' => $supportUser->id,
                'first_response_at' => $ticket->first_response_at ?? $now,
                'sla_status' => 'WITHIN_SLA',
            ]);

            // Audit Activity
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $supportUser->id,
                'action' => 'Ticket Assigned / Taken',
                'actor_name' => $supportUser->name,
                'actor_role' => $supportUser->role,
                'note' => "Tiket diambil oleh {$supportUser->name} untuk segera dilakukan investigasi.",
            ]);

            // Notification for Requester
            Notification::create([
                'user_id' => $ticket->requester_id,
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->number,
                'type' => 'assigned',
                'title' => 'Tiket Sedang Ditangani',
                'message' => "Tiket {$ticket->number} telah ditugaskan kepada {$supportUser->name}.",
            ]);

            return $ticket;
        });
    }

    /**
     * Admin assigns / reassigns ticket to a support user
     */
    public function assignTicket(Ticket $ticket, ?User $assignee, ?string $reason, User $adminUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $assignee, $reason, $adminUser) {
            $ticket->lockForUpdate();

            if (!$assignee) {
                // Unassign
                $ticket->update([
                    'status' => 'OPEN',
                    'assignee_id' => null,
                ]);

                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $adminUser->id,
                    'action' => 'Ticket Unassigned by Admin',
                    'actor_name' => $adminUser->name,
                    'actor_role' => 'Admin',
                    'note' => 'Penugasan dibatalkan oleh Administrator. ' . ($reason ? "Alasan: \"{$reason}\"" : ''),
                ]);
            } else {
                // Assign
                $nextStatus = $ticket->status === 'OPEN' ? 'IN_PROGRESS' : $ticket->status;
                $ticket->update([
                    'status' => $nextStatus,
                    'assignee_id' => $assignee->id,
                ]);

                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $adminUser->id,
                    'action' => 'Ticket Assigned by Admin',
                    'actor_name' => $adminUser->name,
                    'actor_role' => 'Admin',
                    'note' => "Admin menugaskan tiket kepada {$assignee->name}. " . ($reason ? "Alasan: \"{$reason}\"" : ''),
                ]);

                Notification::create([
                    'user_id' => $assignee->id,
                    'ticket_id' => $ticket->id,
                    'ticket_number' => $ticket->number,
                    'type' => 'assigned',
                    'title' => 'Penugasan Tiket Baru',
                    'message' => "Admin menugaskan tiket {$ticket->number} kepada Anda.",
                ]);
            }

            return $ticket;
        });
    }

    /**
     * Admin overrides status
     */
    public function overrideStatus(Ticket $ticket, string $newStatus, string $reason, User $adminUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $newStatus, $reason, $adminUser) {
            $ticket->update([
                'status' => $newStatus,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $adminUser->id,
                'action' => "Admin Status Override to {$newStatus}",
                'actor_name' => $adminUser->name,
                'actor_role' => 'Admin',
                'note' => "Administrator melakukan koreksi status ke {$newStatus}. Alasan: \"{$reason}\"",
            ]);

            return $ticket;
        });
    }

    /**
     * IT Support requests information (sets status to NEED_INFO & pauses SLA)
     */
    public function requestInfo(Ticket $ticket, string $message, User $supportUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $message, $supportUser) {
            $ticket->update([
                'status' => 'NEED_INFO',
                'sla_status' => 'PAUSED',
            ]);

            TicketComment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $supportUser->id,
                'author_name' => $supportUser->name,
                'author_role' => $supportUser->role,
                'body' => "[PERMINTAAN INFORMASI]: {$message}",
                'is_internal' => false,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $supportUser->id,
                'action' => 'Status Changed to NEED_INFO',
                'actor_name' => $supportUser->name,
                'actor_role' => $supportUser->role,
                'note' => "Meminta informasi tambahan: \"" . substr($message, 0, 60) . "...\"",
            ]);

            Notification::create([
                'user_id' => $ticket->requester_id,
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->number,
                'type' => 'action_required',
                'title' => 'Informasi Tambahan Diperlukan',
                'message' => "{$supportUser->name} memerlukan informasi tambahan pada tiket {$ticket->number}: \"{$message}\"",
            ]);

            return $ticket;
        });
    }

    /**
     * IT Support marks ticket as Resolved
     */
    public function resolveTicket(Ticket $ticket, string $resolutionSummary, User $supportUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $resolutionSummary, $supportUser) {
            $now = Carbon::now();
            $ticket->update([
                'status' => 'RESOLVED',
                'resolved_at' => $now,
                'resolution_summary' => $resolutionSummary,
                'sla_status' => 'WITHIN_SLA',
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $supportUser->id,
                'action' => 'Ticket Resolved',
                'actor_name' => $supportUser->name,
                'actor_role' => $supportUser->role,
                'note' => "Tiket diselesaikan dengan ringkasan: \"{$resolutionSummary}\"",
            ]);

            Notification::create([
                'user_id' => $ticket->requester_id,
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->number,
                'type' => 'resolved',
                'title' => 'Tiket Telah Diselesaikan (Resolved)',
                'message' => "Tiket {$ticket->number} telah selesai. Mohon konfirmasi penutupan tiket.",
            ]);

            return $ticket;
        });
    }

    /**
     * IT Support escalates ticket
     */
    public function escalateTicket(Ticket $ticket, string $reason, User $supportUser): Ticket
    {
        return DB::transaction(function () use ($ticket, $reason, $supportUser) {
            $ticket->update([
                'status' => 'ESCALATED',
                'escalation_reason' => $reason,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $supportUser->id,
                'action' => 'Ticket Escalated',
                'actor_name' => $supportUser->name,
                'actor_role' => $supportUser->role,
                'note' => "Eskalasi ke level yang lebih tinggi: \"{$reason}\"",
            ]);

            Notification::create([
                'user_id' => $ticket->requester_id,
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->number,
                'type' => 'escalated',
                'title' => 'Tiket Dieskalasi',
                'message' => "Tiket {$ticket->number} telah dieskalasi ke tim specialist IT Admin.",
            ]);

            return $ticket;
        });
    }

    /**
     * Employee closes resolved ticket
     */
    public function closeTicket(Ticket $ticket, User $employee): Ticket
    {
        return DB::transaction(function () use ($ticket, $employee) {
            $now = Carbon::now();
            $ticket->update([
                'status' => 'CLOSED',
                'closed_at' => $now,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $employee->id,
                'action' => 'Ticket Closed',
                'actor_name' => $employee->name,
                'actor_role' => 'Employee',
                'note' => 'Requester mengonfirmasi bahwa permasalahan telah selesai.',
            ]);

            return $ticket;
        });
    }

    /**
     * Employee reopens resolved ticket
     */
    public function reopenTicket(Ticket $ticket, string $reason, User $employee): Ticket
    {
        return DB::transaction(function () use ($ticket, $reason, $employee) {
            $ticket->update([
                'status' => 'IN_PROGRESS',
                'resolved_at' => null,
            ]);

            TicketComment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $employee->id,
                'author_name' => $employee->name,
                'author_role' => 'Employee',
                'body' => "[REOPEN REASON]: {$reason}",
                'is_internal' => false,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $employee->id,
                'action' => 'Ticket Reopened',
                'actor_name' => $employee->name,
                'actor_role' => 'Employee',
                'note' => "Tiket dibuka kembali oleh requester dengan alasan: \"{$reason}\"",
            ]);

            if ($ticket->assignee_id) {
                Notification::create([
                    'user_id' => $ticket->assignee_id,
                    'ticket_id' => $ticket->id,
                    'ticket_number' => $ticket->number,
                    'type' => 'status_change',
                    'title' => 'Tiket Dibuka Kembali',
                    'message' => "Requester membuka kembali tiket {$ticket->number}.",
                ]);
            }

            return $ticket;
        });
    }

    /**
     * Employee submits rating for closed ticket
     */
    public function submitRating(Ticket $ticket, int $score, ?string $feedback, User $employee): TicketRating
    {
        return DB::transaction(function () use ($ticket, $score, $feedback, $employee) {
            $rating = TicketRating::updateOrCreate(
                ['ticket_id' => $ticket->id],
                [
                    'user_id' => $employee->id,
                    'score' => $score,
                    'feedback' => $feedback,
                ]
            );

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $employee->id,
                'action' => 'Rating Submitted',
                'actor_name' => $employee->name,
                'actor_role' => 'Employee',
                'note' => "Memberikan penilaian {$score}/5 bintang: \"" . ($feedback ?: 'Tanpa komentar') . "\"",
            ]);

            return $rating;
        });
    }

    /**
     * Add comment to ticket (public or internal note)
     */
    public function addComment(Ticket $ticket, string $body, bool $isInternal, User $user): TicketComment
    {
        return DB::transaction(function () use ($ticket, $body, $isInternal, $user) {
            $comment = TicketComment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'author_name' => $user->name,
                'author_role' => $user->role,
                'body' => $body,
                'is_internal' => $isInternal,
            ]);

            // If employee replies when status is NEED_INFO, automatically resume to IN_PROGRESS
            if ($ticket->status === 'NEED_INFO' && $user->role === 'Employee') {
                $ticket->update([
                    'status' => 'IN_PROGRESS',
                    'sla_status' => 'WITHIN_SLA',
                ]);
            }

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'action' => $isInternal ? 'Internal Note Added' : 'Comment Added',
                'actor_name' => $user->name,
                'actor_role' => $user->role,
                'note' => $isInternal ? 'Catatan internal ditambahkan untuk tim IT.' : "Membalas pesan: \"" . substr($body, 0, 50) . "...\"",
            ]);

            return $comment;
        });
    }
}
