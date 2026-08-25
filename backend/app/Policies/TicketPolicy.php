<?php
namespace App\Policies;
use App\Models\{Ticket,User};
class TicketPolicy { public function view(User $user,Ticket $ticket):bool{return $user->role==='ADMIN'||$user->role==='IT_SUPPORT'||$ticket->requester_id===$user->id;} public function update(User $user,Ticket $ticket):bool{return $user->role!=='EMPLOYEE'||$ticket->requester_id===$user->id;} public function assign(User $user):bool{return in_array($user->role,['ADMIN','IT_SUPPORT']);} }
