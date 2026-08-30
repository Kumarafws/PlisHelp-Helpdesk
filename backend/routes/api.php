<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes (Laravel 13 - RESTful API v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --------------------------------------------------------------------------
    // Public Authentication
    // --------------------------------------------------------------------------
    Route::post('auth/login', [AuthController::class, 'login']);

    // --------------------------------------------------------------------------
    // Protected Routes (Sanctum Token Required)
    // --------------------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {

        // Session & Auth
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        // Dashboard Analytics
        Route::get('dashboard/summary', [DashboardController::class, 'summary']);

        // Tickets CRUD & Workflow Actions
        Route::get('tickets', [TicketController::class, 'index']);
        Route::post('tickets', [TicketController::class, 'store']);
        Route::get('tickets/{ticket}', [TicketController::class, 'show']);
        
        // Ticket Action Transitions
        Route::post('tickets/{ticket}/take', [TicketController::class, 'take']);
        Route::post('tickets/{ticket}/assign', [TicketController::class, 'assign']);
        Route::post('tickets/{ticket}/override-status', [TicketController::class, 'overrideStatus']);
        Route::post('tickets/{ticket}/request-info', [TicketController::class, 'requestInfo']);
        Route::post('tickets/{ticket}/resolve', [TicketController::class, 'resolve']);
        Route::post('tickets/{ticket}/escalate', [TicketController::class, 'escalate']);
        Route::post('tickets/{ticket}/close', [TicketController::class, 'close']);
        Route::post('tickets/{ticket}/reopen', [TicketController::class, 'reopen']);
        Route::post('tickets/{ticket}/rating', [TicketController::class, 'submitRating']);
        Route::post('tickets/{ticket}/comments', [TicketController::class, 'comment']);

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

        // User Management (Admin)
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);

        // Master Data (Departments, Categories, SLA Policies)
        Route::get('departments', [MasterDataController::class, 'getDepartments']);
        Route::post('departments', [MasterDataController::class, 'saveDepartment']);
        Route::patch('departments/{department}/toggle-status', [MasterDataController::class, 'toggleDepartmentStatus']);

        Route::get('categories', [MasterDataController::class, 'getCategories']);
        Route::post('categories', [MasterDataController::class, 'saveCategory']);
        Route::patch('categories/{category}/toggle-status', [MasterDataController::class, 'toggleCategoryStatus']);

        Route::get('sla-policies', [MasterDataController::class, 'getSlaPolicies']);
        Route::post('sla-policies', [MasterDataController::class, 'saveSlaPolicies']);
    });
});
