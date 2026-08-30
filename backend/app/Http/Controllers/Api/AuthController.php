<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login with email and password, return Sanctum token + user profile
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::with('department')->where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial email atau password tidak sesuai.'],
            ]);
        }

        if ($user->status !== 'ACTIVE') {
            return response()->json([
                'message' => 'Akun Anda saat ini dinonaktifkan. Silakan hubungi IT Administrator.',
            ], 403);
        }

        // Generate Sanctum Plaintext Token
        $token = $user->createToken('plishelp_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department?->name ?? 'IT Operations & Helpdesk',
                'department_id' => $user->department_id,
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Get currently authenticated user profile
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('department');

        return response()->json([
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department?->name ?? 'IT Operations & Helpdesk',
                'department_id' => $user->department_id,
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Logout and revoke current token
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesi berhasil diakhiri (Logout).',
        ]);
    }
}
