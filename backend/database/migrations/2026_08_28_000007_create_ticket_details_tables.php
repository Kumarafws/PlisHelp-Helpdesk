<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Comments
        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('author_name', 150);
            $table->string('author_role', 50);
            $table->text('body');
            $table->boolean('is_internal')->default(false)->index();
            $table->timestamps();
        });

        // 2. Activities / Audit Trail
        Schema::create('ticket_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 150);
            $table->string('actor_name', 150);
            $table->string('actor_role', 50);
            $table->text('note')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
        });

        // 3. Attachments
        Schema::create('ticket_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('file_name', 255);
            $table->string('file_size', 50);
            $table->unsignedBigInteger('file_size_bytes')->nullable();
            $table->string('file_type', 100);
            $table->string('disk', 50)->default('local');
            $table->string('path', 500);
            $table->timestamps();
        });

        // 4. Ratings
        Schema::create('ticket_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->unique()->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('score'); // 1-5
            $table->text('feedback')->nullable();
            $table->timestamps();
        });

        // 5. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('ticket_id')->nullable()->constrained('tickets')->nullOnDelete();
            $table->string('ticket_number', 50)->nullable();
            $table->string('type', 50); // 'status_change', 'assigned', 'action_required', 'resolved', 'escalated', 'rating'
            $table->string('title', 200);
            $table->text('message');
            $table->boolean('is_read')->default(false)->index();
            $table->timestampTz('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('ticket_ratings');
        Schema::dropIfExists('ticket_attachments');
        Schema::dropIfExists('ticket_activities');
        Schema::dropIfExists('ticket_comments');
    }
};
