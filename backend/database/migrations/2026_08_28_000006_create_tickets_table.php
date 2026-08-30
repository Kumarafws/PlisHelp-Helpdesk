<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('number', 50)->unique();
            $table->string('title', 255);
            $table->text('description');
            $table->string('type', 50)->default('Incident'); // 'Incident', 'Request'
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('subcategory_id')->nullable()->constrained('subcategories')->nullOnDelete();
            $table->string('subcategory_name', 150)->nullable();
            $table->string('priority', 30)->default('MEDIUM')->index(); // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
            $table->string('status', 50)->default('OPEN')->index(); // 'OPEN', 'IN_PROGRESS', 'NEED_INFO', 'ESCALATED', 'RESOLVED', 'CLOSED'
            
            $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('department_id')->constrained('departments')->restrictOnDelete();

            // SLA Tracking
            $table->timestampTz('sla_due_at')->nullable()->index();
            $table->timestampTz('first_response_at')->nullable();
            $table->timestampTz('resolved_at')->nullable();
            $table->timestampTz('closed_at')->nullable();
            $table->unsignedInteger('sla_response_minutes')->default(30);
            $table->unsignedInteger('sla_resolution_hours')->default(4);
            $table->string('sla_status', 30)->default('WITHIN_SLA'); // 'WITHIN_SLA', 'NEAR_BREACH', 'BREACHED', 'PAUSED'

            // Resolution / Escalation
            $table->text('resolution_summary')->nullable();
            $table->text('escalation_reason')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
