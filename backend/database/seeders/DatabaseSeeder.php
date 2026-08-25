<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class DatabaseSeeder extends Seeder { public function run(): void { foreach ([['Andi Pratama','andi@plishelp.co.id','employee'],['Budi Santoso','budi@plishelp.co.id','it_support'],['Admin PlisHelp','admin@plishelp.co.id','admin']] as [$name,$email,$role]) User::updateOrCreate(['email'=>$email],['name'=>$name,'role'=>$role,'password'=>Hash::make('password')]); } }
