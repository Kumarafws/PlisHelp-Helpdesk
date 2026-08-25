<?php
namespace App\Services;
use App\Models\Ticket;
class SlaService { public function isOverdue(Ticket $ticket): bool { return $ticket->sla_due_at?->isPast() && !in_array($ticket->status,['RESOLVED','CLOSED']); } public function pause(Ticket $ticket): void { $ticket->sla_paused_at=now(); $ticket->save(); } public function resume(Ticket $ticket): void { if($ticket->sla_paused_at){$ticket->sla_paused_seconds=($ticket->sla_paused_seconds??0)+$ticket->sla_paused_at->diffInSeconds(now());$ticket->sla_paused_at=null;$ticket->save();} } }
