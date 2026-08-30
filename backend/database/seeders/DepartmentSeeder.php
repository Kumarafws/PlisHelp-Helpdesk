<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Marketing & Communications', 'code' => 'MKTG', 'is_active' => true],
            ['name' => 'IT Operations & Helpdesk', 'code' => 'IT-OPS', 'is_active' => true],
            ['name' => 'Finance & Accounting', 'code' => 'FIN', 'is_active' => true],
            ['name' => 'Human Resources & General Affairs', 'code' => 'HRGA', 'is_active' => true],
            ['name' => 'Sales & Business Development', 'code' => 'SALES', 'is_active' => true],
            ['name' => 'Engineering & Software Product', 'code' => 'ENG', 'is_active' => true],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(
                ['code' => $dept['code']],
                ['name' => $dept['name'], 'is_active' => $dept['is_active']]
            );
        }
    }
}
