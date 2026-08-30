<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ticket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'number',
        'title',
        'description',
        'type',
        'category_id',
        'subcategory_id',
        'subcategory_name',
        'priority',
        'status',
        'requester_id',
        'assignee_id',
        'department_id',
        'sla_due_at',
        'first_response_at',
        'resolved_at',
        'closed_at',
        'sla_response_minutes',
        'sla_resolution_hours',
        'sla_status',
        'resolution_summary',
        'escalation_reason',
    ];

    protected function casts(): array
    {
        return [
            'sla_due_at' => 'datetime',
            'first_response_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
            'sla_response_minutes' => 'integer',
            'sla_resolution_hours' => 'integer',
        ];
    }

    // Relations
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class)->orderBy('created_at', 'asc');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(TicketActivity::class)->orderBy('created_at', 'desc');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function rating(): HasOne
    {
        return $this->hasOne(TicketRating::class);
    }

    // Dynamic SLA Remaining Time Accessor
    public function getSlaRemainingFormattedAttribute(): string
    {
        if (in_array($this->status, ['RESOLVED', 'CLOSED'])) {
            return 'Completed';
        }
        if ($this->status === 'NEED_INFO') {
            return 'Paused';
        }
        if (!$this->sla_due_at) {
            return '-';
        }

        $now = now();
        if ($this->sla_due_at->isPast()) {
            return '00h 00m (Breached)';
        }

        $diffHours = $now->diffInHours($this->sla_due_at);
        $diffMinutes = $now->diffInMinutes($this->sla_due_at) % 60;

        return sprintf('%02dh %02dm', $diffHours, $diffMinutes);
    }

    // Scopes
    public function scopeForUser($query, User $user)
    {
        if ($user->role === 'Employee') {
            return $query->where('requester_id', $user->id);
        }
        return $query;
    }

    public function scopeStatus($query, ?string $status)
    {
        if (!$status || $status === 'ALL') {
            return $query;
        }
        if ($status === 'AVAILABLE') {
            return $query->where('status', 'OPEN')->whereNull('assignee_id');
        }
        if ($status === 'ASSIGNED_TO_ME') {
            return $query->where('assignee_id', auth()->id());
        }
        return $query->where('status', $status);
    }

    public function scopePriority($query, ?string $priority)
    {
        return ($priority && $priority !== 'ALL') ? $query->where('priority', $priority) : $query;
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        $term = '%' . $search . '%';
        return $query->where(function ($q) use ($term) {
            $q->where('number', 'ILIKE', $term)
              ->orWhere('title', 'ILIKE', $term)
              ->orWhere('description', 'ILIKE', $term)
              ->orWhereHas('requester', fn($uq) => $uq->where('name', 'ILIKE', $term))
              ->orWhereHas('department', fn($dq) => $dq->where('name', 'ILIKE', $term));
        });
    }

    public function scopeBreached($query)
    {
        return $query->whereNotIn('status', ['RESOLVED', 'CLOSED'])
                     ->where('sla_due_at', '<', now());
    }
}
