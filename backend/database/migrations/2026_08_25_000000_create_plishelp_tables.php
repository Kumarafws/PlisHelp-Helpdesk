<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('departments', fn(Blueprint $t) => [$t->id(), $t->string('name'), $t->timestamps()]);
        Schema::create('categories', fn(Blueprint $t) => [$t->id(), $t->string('name'), $t->boolean('is_active')->default(true), $t->timestamps()]);
        Schema::create('users', function(Blueprint $t) { $t->id(); $t->string('name'); $t->string('email')->unique(); $t->string('role')->index(); $t->foreignId('department_id')->nullable()->constrained()->nullOnDelete(); $t->string('password'); $t->rememberToken(); $t->timestamps(); });
        Schema::create('tickets', function(Blueprint $t) { $t->id(); $t->string('number')->unique(); $t->foreignId('requester_id')->constrained('users'); $t->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete(); $t->foreignId('department_id')->constrained(); $t->foreignId('category_id')->constrained(); $t->string('title'); $t->text('description'); $t->string('priority')->default('medium')->index(); $t->string('status')->default('open')->index(); $t->timestampTz('sla_due_at')->nullable()->index(); $t->timestampTz('first_response_at')->nullable(); $t->timestampTz('resolved_at')->nullable(); $t->text('resolution')->nullable(); $t->softDeletes(); $t->timestamps(); });
        Schema::create('ticket_comments', function(Blueprint $t) { $t->id(); $t->foreignId('ticket_id')->constrained()->cascadeOnDelete(); $t->foreignId('user_id')->constrained()->cascadeOnDelete(); $t->text('body'); $t->timestamps(); });
        Schema::create('ticket_activities', function(Blueprint $t) { $t->id(); $t->foreignId('ticket_id')->constrained()->cascadeOnDelete(); $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); $t->string('action'); $t->jsonb('metadata')->nullable(); $t->timestamps(); });
        Schema::create('ticket_attachments', function(Blueprint $t) { $t->id(); $t->foreignId('ticket_id')->constrained()->cascadeOnDelete(); $t->foreignId('uploaded_by')->constrained('users'); $t->string('file_name'); $t->string('disk')->default('local'); $t->string('path'); $t->unsignedBigInteger('size'); $t->timestamps(); });
        Schema::create('notifications', function(Blueprint $t) { $t->id(); $t->foreignId('user_id')->constrained()->cascadeOnDelete(); $t->foreignId('ticket_id')->nullable()->constrained()->nullOnDelete(); $t->string('type'); $t->string('title'); $t->text('body'); $t->timestampTz('read_at')->nullable(); $t->timestamps(); });
        Schema::create('ticket_ratings', function(Blueprint $t) { $t->id(); $t->foreignId('ticket_id')->unique()->constrained()->cascadeOnDelete(); $t->foreignId('user_id')->constrained()->cascadeOnDelete(); $t->unsignedTinyInteger('score'); $t->text('feedback')->nullable(); $t->timestamps(); });
    }
    public function down(): void { Schema::disableForeignKeyConstraints(); foreach (['ticket_ratings','notifications','ticket_attachments','ticket_activities','ticket_comments','tickets','users','categories','departments'] as $table) Schema::dropIfExists($table); Schema::enableForeignKeyConstraints(); }
};
