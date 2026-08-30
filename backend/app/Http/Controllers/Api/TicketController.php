<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketAttachment;
use App\Services\TicketWorkflowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(
        protected TicketWorkflowService $workflowService
    ) {}

    /**
     * List all tickets with role-based scoping, search, and filters
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Ticket::with(['requester', 'assignee', 'department', 'category', 'rating'])
            ->forUser($user)
            ->status($request->query('status'))
            ->priority($request->query('priority'))
            ->search($request->query('q'))
            ->orderBy('created_at', 'desc');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        $tickets = $query->paginate($request->query('per_page', 15));

        return response()->json($tickets);
    }

    /**
     * Create a new ticket
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'type' => ['nullable', 'string', 'in:Incident,Request'],
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:subcategories,id'],
            'subcategory_name' => ['nullable', 'string'],
            'priority' => ['nullable', 'string', 'in:LOW,MEDIUM,HIGH,CRITICAL'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'attachments' => ['nullable', 'array'],
            'attachments.*.file_name' => ['required_with:attachments', 'string'],
            'attachments.*.file_size' => ['required_with:attachments', 'string'],
            'attachments.*.file_type' => ['required_with:attachments', 'string'],
            'attachments.*.path' => ['required_with:attachments', 'string'],
        ]);

        $ticket = $this->workflowService->createTicket($validated, $request->user());

        // Handle attachments if provided
        if (!empty($validated['attachments'])) {
            foreach ($validated['attachments'] as $att) {
                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'uploaded_by' => $request->user()->id,
                    'file_name' => $att['file_name'],
                    'file_size' => $att['file_size'],
                    'file_type' => $att['file_type'],
                    'path' => $att['path'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Tiket berhasil dibuat.',
            'ticket' => $ticket->load(['requester', 'department', 'category', 'attachments']),
        ], 201);
    }

    /**
     * Get single ticket detail with full relational audit trail
     */
    public function show(Request $request, Ticket $ticket): JsonResponse
    {
        // Authorization check: Employees can only view their own tickets
        if ($request->user()->role === 'Employee' && $ticket->requester_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $ticket->load([
            'requester',
            'assignee',
            'department',
            'category',
            'subcategory',
            'comments',
            'activities',
            'attachments',
            'rating',
        ]);

        // Hide internal comments for regular employees
        if ($request->user()->role === 'Employee') {
            $ticket->setRelation(
                'comments',
                $ticket->comments->filter(fn($c) => !$c->is_internal)->values()
            );
        }

        return response()->json($ticket);
    }

    /**
     * IT Support takes ticket
     */
    public function take(Request $request, Ticket $ticket): JsonResponse
    {
        if ($request->user()->role !== 'IT Support' && $request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Hanya IT Support yang dapat mengambil tiket.'], 403);
        }

        $updated = $this->workflowService->takeTicket($ticket, $request->user());

        return response()->json([
            'message' => "Tiket {$updated->number} berhasil diambil.",
            'ticket' => $updated->load(['assignee', 'activities']),
        ]);
    }

    /**
     * Admin assigns / reassigns / unassigns ticket
     */
    public function assign(Request $request, Ticket $ticket): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Hanya Administrator yang memiliki otorisasi penugasan.'], 403);
        }

        $validated = $request->validate([
            'assignee_id' => ['nullable', 'exists:users,id'],
            'reason' => ['nullable', 'string'],
        ]);

        $assignee = !empty($validated['assignee_id']) ? User::find($validated['assignee_id']) : null;
        $updated = $this->workflowService->assignTicket($ticket, $assignee, $validated['reason'] ?? null, $request->user());

        return response()->json([
            'message' => 'Penugasan tiket berhasil diperbarui.',
            'ticket' => $updated->load(['assignee', 'activities']),
        ]);
    }

    /**
     * Admin overrides ticket status
     */
    public function overrideStatus(Request $request, Ticket $ticket): JsonResponse
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Hanya Administrator yang memiliki otorisasi override status.'], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:OPEN,IN_PROGRESS,NEED_INFO,ESCALATED,RESOLVED,CLOSED'],
            'reason' => ['required', 'string', 'min:10'],
        ]);

        $updated = $this->workflowService->overrideStatus($ticket, $validated['status'], $validated['reason'], $request->user());

        return response()->json([
            'message' => "Status tiket berhasil di-override ke {$validated['status']}.",
            'ticket' => $updated->load('activities'),
        ]);
    }

    /**
     * IT Support requests more info
     */
    public function requestInfo(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:5'],
        ]);

        $updated = $this->workflowService->requestInfo($ticket, $validated['message'], $request->user());

        return response()->json([
            'message' => 'Permintaan informasi berhasil dikirimkan.',
            'ticket' => $updated->load(['comments', 'activities']),
        ]);
    }

    /**
     * IT Support marks ticket as resolved
     */
    public function resolve(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'resolution_summary' => ['required', 'string', 'min:15'],
        ]);

        $updated = $this->workflowService->resolveTicket($ticket, $validated['resolution_summary'], $request->user());

        return response()->json([
            'message' => 'Tiket berhasil diselesaikan (Resolved).',
            'ticket' => $updated->load('activities'),
        ]);
    }

    /**
     * IT Support escalates ticket
     */
    public function escalate(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:10'],
        ]);

        $updated = $this->workflowService->escalateTicket($ticket, $validated['reason'], $request->user());

        return response()->json([
            'message' => 'Tiket berhasil dieskalasi ke IT Admin Specialist.',
            'ticket' => $updated->load('activities'),
        ]);
    }

    /**
     * Employee closes ticket
     */
    public function close(Request $request, Ticket $ticket): JsonResponse
    {
        $updated = $this->workflowService->closeTicket($ticket, $request->user());

        return response()->json([
            'message' => 'Tiket resmi ditutup. Terima kasih.',
            'ticket' => $updated->load('activities'),
        ]);
    }

    /**
     * Employee reopens ticket
     */
    public function reopen(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:5'],
        ]);

        $updated = $this->workflowService->reopenTicket($ticket, $validated['reason'], $request->user());

        return response()->json([
            'message' => 'Tiket berhasil dibuka kembali untuk investigasi ulang.',
            'ticket' => $updated->load(['comments', 'activities']),
        ]);
    }

    /**
     * Employee submits rating
     */
    public function submitRating(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'score' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['nullable', 'string', 'max:500'],
        ]);

        $rating = $this->workflowService->submitRating($ticket, $validated['score'], $validated['feedback'] ?? null, $request->user());

        return response()->json([
            'message' => 'Terima kasih atas rating dan feedback yang Anda berikan.',
            'rating' => $rating,
        ]);
    }

    /**
     * Post a comment / internal note on a ticket
     */
    public function comment(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'min:2'],
            'is_internal' => ['nullable', 'boolean'],
        ]);

        $isInternal = (bool) ($validated['is_internal'] ?? false);

        // Regular employees cannot create internal notes
        if ($request->user()->role === 'Employee') {
            $isInternal = false;
        }

        $comment = $this->workflowService->addComment($ticket, $validated['body'], $isInternal, $request->user());

        return response()->json([
            'message' => $isInternal ? 'Catatan internal tersimpan.' : 'Pesan berhasil dikirim.',
            'comment' => $comment,
        ], 201);
    }
}
