<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $deptMktg = Department::where('code', 'MKTG')->first();
        $deptItOps = Department::where('code', 'IT-OPS')->first();
        $deptFin = Department::where('code', 'FIN')->first();
        $deptHrga = Department::where('code', 'HRGA')->first();

        $users = [
            [
                'name' => 'Andi Pratama',
                'email' => 'andi@plishelp.co.id',
                'password' => 'password123',
                'role' => 'Employee',
                'department_id' => $deptMktg?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@plishelp.co.id',
                'password' => 'password123',
                'role' => 'IT Support',
                'department_id' => $deptItOps?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Dimas Saputra',
                'email' => 'dimas@plishelp.co.id',
                'password' => 'password123',
                'role' => 'IT Support',
                'department_id' => $deptItOps?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Siti Rahmawati',
                'email' => 'siti@plishelp.co.id',
                'password' => 'password123',
                'role' => 'IT Support',
                'department_id' => $deptItOps?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Admin PlisHelp',
                'email' => 'admin@plishelp.co.id',
                'password' => 'password123',
                'role' => 'Admin',
                'department_id' => $deptItOps?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Clara Wijaya',
                'email' => 'clara@plishelp.co.id',
                'password' => 'password123',
                'role' => 'Employee',
                'department_id' => $deptFin?->id,
                'status' => 'ACTIVE',
            ],
            [
                'name' => 'Rian Kurniawan',
                'email' => 'rian@plishelp.co.id',
                'password' => 'password123',
                'role' => 'Employee',
                'department_id' => $deptHrga?->id,
                'status' => 'INACTIVE',
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make($u['password']),
                    'role' => $u['role'],
                    'department_id' => $u['department_id'],
                    'status' => $u['status'],
                ]
            );
        }
    }
}
