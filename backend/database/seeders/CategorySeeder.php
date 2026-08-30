<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Network & Connectivity',
                'subcategories' => ['Wi-Fi Kantor', 'VPN & Remote Access', 'Koneksi LAN Kabel', 'DNS & Proxy'],
            ],
            [
                'name' => 'Hardware & Devices',
                'subcategories' => ['Laptop / PC', 'Monitor Eksternal', 'Keyboard / Mouse', 'Printer & Scanner', 'Docking Station'],
            ],
            [
                'name' => 'Software & Application',
                'subcategories' => ['Operating System (Windows/Mac)', 'Adobe Creative Cloud', 'Microsoft 365 / Office', 'Figma', 'Antivirus'],
            ],
            [
                'name' => 'Access & Accounts',
                'subcategories' => ['Shared Drive Marketing', 'Email Perusahaan', 'Portal HR / Payroll', 'ERP & Database Access'],
            ],
        ];

        foreach ($data as $catItem) {
            $category = Category::updateOrCreate(
                ['name' => $catItem['name']],
                ['is_active' => true]
            );

            foreach ($catItem['subcategories'] as $subName) {
                Subcategory::updateOrCreate(
                    ['category_id' => $category->id, 'name' => $subName],
                    ['is_active' => true]
                );
            }
        }
    }
}
