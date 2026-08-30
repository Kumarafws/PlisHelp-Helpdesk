<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SLAPolicy;

class SLAPolicySeeder extends Seeder
{
    public function run(): void
    {
        $policies = [
            [
                'priority' => 'CRITICAL',
                'response_target_minutes' => 15,
                'resolution_target_hours' => 2,
                'description' => 'Kendala kritis yang menghentikan operasional seluruh tim/departemen.',
            ],
            [
                'priority' => 'HIGH',
                'response_target_minutes' => 30,
                'resolution_target_hours' => 4,
                'description' => 'Gangguan serius pada perangkat/koneksi kerja utama individu.',
            ],
            [
                'priority' => 'MEDIUM',
                'response_target_minutes' => 60,
                'resolution_target_hours' => 12,
                'description' => 'Permintaan software standar atau kendala non-blocking.',
            ],
            [
                'priority' => 'LOW',
                'response_target_minutes' => 120,
                'resolution_target_hours' => 48,
                'description' => 'Pertanyaan umum atau permohonan akses minor jangka panjang.',
            ],
        ];

        foreach ($policies as $p) {
            SLAPolicy::updateOrCreate(
                ['priority' => $p['priority']],
                [
                    'response_target_minutes' => $p['response_target_minutes'],
                    'resolution_target_hours' => $p['resolution_target_hours'],
                    'description' => $p['description'],
                ]
            );
        }
    }
}
