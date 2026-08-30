<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * List all managed users (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('department')->orderBy('name', 'asc');

        if ($request->filled('role') && $request->query('role') !== 'ALL') {
            $query->where('role', $request->query('role'));
        }

        if ($request->filled('status') && $request->query('status') !== 'ALL') {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('q')) {
            $term = '%' . $request->query('q') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'ILIKE', $term)
                  ->orWhere('email', 'ILIKE', $term);
            });
        }

        return response()->json($query->paginate($request->query('per_page', 20)));
    }

    /**
     * Create a new user (Admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', 'string', 'in:Employee,IT Support,Admin'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'status' => ['nullable', 'string', 'in:ACTIVE,INACTIVE'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'] ?? 'password123'),
            'role' => $validated['role'],
            'department_id' => $validated['department_id'] ?? null,
            'status' => $validated['status'] ?? 'ACTIVE',
        ]);

        return response()->json([
            'message' => "Akun {$user->name} berhasil dibuat.",
            'user' => $user->load('department'),
        ], 201);
    }

    /**
     * Update user details (Admin only)
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', 'string', 'in:Employee,IT Support,Admin'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'status' => ['nullable', 'string', 'in:ACTIVE,INACTIVE'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'department_id' => $validated['department_id'] ?? null,
            'status' => $validated['status'] ?? $user->status,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => "Akun {$user->name} berhasil diperbarui.",
            'user' => $user->load('department'),
        ]);
    }

    /**
     * Toggle user active status (Admin only)
     */
    public function toggleStatus(User $user): JsonResponse
    {
        $newStatus = $user->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $user->update(['status' => $newStatus]);

        return response()->json([
            'message' => "Status akun {$user->name} berhasil diubah menjadi {$newStatus}.",
            'user' => $user,
        ]);
    }
}
