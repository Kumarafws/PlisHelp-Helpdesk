<?php
namespace App\Services;
use App\Models\Ticket;
class TicketWorkflowService { public function transition(Ticket $ticket,string $status):Ticket { $ticket->status=$status; if($status==='RESOLVED')$ticket->resolved_at=now(); if($status==='CLOSED')$ticket->closed_at=now(); if($status==='NEED_INFO')app(SlaService::class)->pause($ticket); else app(SlaService::class)->resume($ticket); $ticket->save(); return $ticket->refresh(); } }
