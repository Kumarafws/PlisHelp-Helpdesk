<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sla_policies', function (Blueprint $table) {
            $table->id();
            $table->string('priority', 30)->unique(); // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
            $table->unsignedInteger('response_target_minutes')->default(60);
            $table->unsignedInteger('resolution_target_hours')->default(24);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sla_policies');
    }
};
