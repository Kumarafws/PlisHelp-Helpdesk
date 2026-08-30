<?php

namespace App\Services;

use App\Models\SLAPolicy;
use App\Models\Ticket;
use Carbon\Carbon;

class SlaService
{
    /**
     * Calculate initial SLA due date based on priority policy
     */
    public function calculateSlaDueAt(string $priority): Carbon
    {
        $policy = SLAPolicy::where('priority', strtoupper($priority))->first();

        $hours = $policy ? $policy->resolution_target_hours : 24;

        return Carbon::now()->addHours($hours);
    }

    /**
     * Get Response & Resolution targets for a priority
     */
    public function getPolicyTargets(string $priority): array
    {
        $policy = SLAPolicy::where('priority', strtoupper($priority))->first();

        return [
            'response_minutes' => $policy ? $policy->response_target_minutes : 30,
            'resolution_hours' => $policy ? $policy->resolution_target_hours : 4,
        ];
    }

    /**
     * Evaluate SLA status for a given ticket
     */
    public function evaluateTicketSlaStatus(Ticket $ticket): string
    {
        if (in_array($ticket->status, ['RESOLVED', 'CLOSED'])) {
            return 'WITHIN_SLA';
        }

        if ($ticket->status === 'NEED_INFO') {
            return 'PAUSED';
        }

        if (!$ticket->sla_due_at) {
            return 'WITHIN_SLA';
        }

        $now = Carbon::now();

        if ($ticket->sla_due_at->isPast()) {
            return 'BREACHED';
        }

        if ($now->diffInMinutes($ticket->sla_due_at, false) <= 60) {
            return 'NEAR_BREACH';
        }

        return 'WITHIN_SLA';
    }
}
