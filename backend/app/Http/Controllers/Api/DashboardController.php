<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Role-aware Dashboard Summary
     */
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'Admin') {
            return $this->getAdminSummary();
        }

        if ($user->role === 'IT Support') {
            return $this->getSupportSummary($user);
        }

        return $this->getEmployeeSummary($user);
    }

    /**
     * Employee Dashboard Summary
     */
    protected function getEmployeeSummary(User $user): JsonResponse
    {
        $ticketsQuery = Ticket::where('requester_id', $user->id);

        $counts = [
            'total' => (clone $ticketsQuery)->count(),
            'open' => (clone $ticketsQuery)->where('status', 'OPEN')->count(),
            'in_progress' => (clone $ticketsQuery)->where('status', 'IN_PROGRESS')->count(),
            'need_info' => (clone $ticketsQuery)->where('status', 'NEED_INFO')->count(),
            'resolved' => (clone $ticketsQuery)->where('status', 'RESOLVED')->count(),
            'closed' => (clone $ticketsQuery)->where('status', 'CLOSED')->count(),
        ];

        $recentTickets = (clone $ticketsQuery)
            ->with(['category', 'department', 'assignee'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'role' => 'Employee',
            'summary' => $counts,
            'recent_tickets' => $recentTickets,
        ]);
    }

    /**
     * IT Support Dashboard Summary
     */
    protected function getSupportSummary(User $user): JsonResponse
    {
        $myTicketsQuery = Ticket::where('assignee_id', $user->id);

        $counts = [
            'my_active_tickets' => (clone $myTicketsQuery)->whereNotIn('status', ['RESOLVED', 'CLOSED'])->count(),
            'available_in_queue' => Ticket::where('status', 'OPEN')->whereNull('assignee_id')->count(),
            'my_resolved_tickets' => (clone $myTicketsQuery)->where('status', 'RESOLVED')->count(),
            'my_breached_tickets' => (clone $myTicketsQuery)->whereNotIn('status', ['RESOLVED', 'CLOSED'])->where('sla_due_at', '<', now())->count(),
        ];

        $availableTickets = Ticket::with(['category', 'department', 'requester'])
            ->where('status', 'OPEN')
            ->whereNull('assignee_id')
            ->orderBy('created_at', 'asc')
            ->limit(5)
            ->get();

        $myRecentTickets = (clone $myTicketsQuery)
            ->with(['category', 'department', 'requester'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'role' => 'IT Support',
            'summary' => $counts,
            'available_tickets' => $availableTickets,
            'my_recent_tickets' => $myRecentTickets,
        ]);
    }

    /**
     * Admin System-Wide Dashboard Summary & Monitoring
     */
    protected function getAdminSummary(): JsonResponse
    {
        $totalTickets = Ticket::count();

        $counts = [
            'total_tickets' => $totalTickets,
            'open_queue' => Ticket::where('status', 'OPEN')->count(),
            'in_progress' => Ticket::where('status', 'IN_PROGRESS')->count(),
            'need_info' => Ticket::where('status', 'NEED_INFO')->count(),
            'escalated' => Ticket::where('status', 'ESCALATED')->count(),
            'resolved' => Ticket::where('status', 'RESOLVED')->count(),
            'closed' => Ticket::where('status', 'CLOSED')->count(),
            'breached_sla' => Ticket::whereNotIn('status', ['RESOLVED', 'CLOSED'])->where('sla_due_at', '<', now())->count(),
            'active_support_staff' => User::where('role', 'IT Support')->where('status', 'ACTIVE')->count(),
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_categories' => Category::count(),
        ];

        // Priority breakdown
        $priorityDistribution = Ticket::select('priority', DB::raw('count(*) as total'))
            ->groupBy('priority')
            ->pluck('total', 'priority');

        return response()->json([
            'role' => 'Admin',
            'summary' => $counts,
            'priority_distribution' => $priorityDistribution,
        ]);
    }
}
