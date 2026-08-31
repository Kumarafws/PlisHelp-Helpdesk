<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SLAPolicy extends Model
{
    protected $table = 'sla_policies';

    protected $fillable = [
        'priority',
        'response_target_minutes',
        'resolution_target_hours',
        'description',
    ];

    protected $casts = [
        'response_target_minutes' => 'integer',
        'resolution_target_hours' => 'integer',
    ];
}
