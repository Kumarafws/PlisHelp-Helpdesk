<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\SLAPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    // ==========================================
    // 1. DEPARTMENTS
    // ==========================================
    public function getDepartments(): JsonResponse
    {
        $departments = Department::withCount('users')->orderBy('name', 'asc')->get();
        return response()->json($departments);
    }

    public function saveDepartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:30'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $department = Department::updateOrCreate(
            ['id' => $validated['id'] ?? null],
            [
                'name' => $validated['name'],
                'code' => strtoupper($validated['code']),
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        return response()->json([
            'message' => "Departemen {$department->name} berhasil disimpan.",
            'department' => $department,
        ]);
    }

    public function toggleDepartmentStatus(Department $department): JsonResponse
    {
        $department->update(['is_active' => !$department->is_active]);

        return response()->json([
            'message' => "Status departemen {$department->name} berhasil diubah.",
            'department' => $department,
        ]);
    }

    // ==========================================
    // 2. CATEGORIES & SUBCATEGORIES
    // ==========================================
    public function getCategories(): JsonResponse
    {
        $categories = Category::with(['subcategories' => function ($q) {
            $q->where('is_active', true);
        }])->orderBy('name', 'asc')->get();

        return response()->json($categories);
    }

    public function saveCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'is_active' => ['nullable', 'boolean'],
            'subcategories' => ['nullable', 'array'],
            'subcategories.*' => ['required', 'string'],
        ]);

        $category = Category::updateOrCreate(
            ['id' => $validated['id'] ?? null],
            [
                'name' => $validated['name'],
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        if (!empty($validated['subcategories'])) {
            // Sync subcategories
            foreach ($validated['subcategories'] as $subName) {
                Subcategory::updateOrCreate(
                    ['category_id' => $category->id, 'name' => $subName],
                    ['is_active' => true]
                );
            }
        }

        return response()->json([
            'message' => "Kategori {$category->name} berhasil disimpan.",
            'category' => $category->load('subcategories'),
        ]);
    }

    public function toggleCategoryStatus(Category $category): JsonResponse
    {
        $category->update(['is_active' => !$category->is_active]);

        return response()->json([
            'message' => "Status kategori {$category->name} berhasil diubah.",
            'category' => $category,
        ]);
    }

    // ==========================================
    // 3. SLA POLICIES
    // ==========================================
    public function getSlaPolicies(): JsonResponse
    {
        $policies = SLAPolicy::orderBy('response_target_minutes', 'asc')->get();
        return response()->json($policies);
    }

    public function saveSlaPolicies(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'policies' => ['required', 'array'],
            'policies.*.priority' => ['required', 'string', 'in:LOW,MEDIUM,HIGH,CRITICAL'],
            'policies.*.response_target_minutes' => ['required', 'integer', 'min:5'],
            'policies.*.resolution_target_hours' => ['required', 'integer', 'min:1'],
            'policies.*.description' => ['nullable', 'string'],
        ]);

        foreach ($validated['policies'] as $pData) {
            SLAPolicy::updateOrCreate(
                ['priority' => $pData['priority']],
                [
                    'response_target_minutes' => $pData['response_target_minutes'],
                    'resolution_target_hours' => $pData['resolution_target_hours'],
                    'description' => $pData['description'] ?? null,
                ]
            );
        }

        return response()->json([
            'message' => 'Kebijakan SLA berhasil diperbarui ke seluruh sistem helpdesk.',
            'policies' => SLAPolicy::all(),
        ]);
    }
}
