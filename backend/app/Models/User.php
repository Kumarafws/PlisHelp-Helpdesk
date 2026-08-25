<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    protected $fillable = ['name','email','password','role','department_id'];
    protected $hidden = ['password','remember_token'];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed']; }
    public function tickets() { return $this->hasMany(Ticket::class, 'requester_id'); }
    public function assignedTickets() { return $this->hasMany(Ticket::class, 'assignee_id'); }
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isSupport(): bool { return in_array($this->role, ['it_support','admin'], true); }
}
