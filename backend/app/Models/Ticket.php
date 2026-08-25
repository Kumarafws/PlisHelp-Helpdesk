<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use SoftDeletes;
    protected $fillable = ['number','requester_id','assignee_id','department_id','category_id','title','description','priority','status','sla_due_at','first_response_at','resolved_at','resolution'];
    protected $casts = ['sla_due_at' => 'datetime', 'first_response_at' => 'datetime', 'resolved_at' => 'datetime'];
    public function requester() { return $this->belongsTo(User::class, 'requester_id'); }
    public function assignee() { return $this->belongsTo(User::class, 'assignee_id'); }
    public function comments() { return $this->hasMany(TicketComment::class); }
    public function activities() { return $this->hasMany(TicketActivity::class); }
    public function scopeForRole($query, User $user) { return $user->role === 'employee' ? $query->where('requester_id', $user->id) : $query; }
    public function scopeStatus($query, ?string $status) { return $status ? $query->where('status', $status) : $query; }
    public function scopePriority($query, ?string $priority) { return $priority ? $query->where('priority', $priority) : $query; }
    public function scopeBreached($query) { return $query->whereNotIn('status', ['resolved','closed'])->where('sla_due_at', '<', now()); }
}
