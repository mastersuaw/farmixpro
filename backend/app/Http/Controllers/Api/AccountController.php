<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Accounts;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $accounts = $this->forCompany($request, Accounts::class)
            ->with(['parent', 'children'])
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($accounts, AccountResource::class, 'Cuentas obtenidas correctamente.');
    }

    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = Accounts::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(
            new AccountResource($account->load(['parent', 'children'])),
            'Cuenta creada correctamente.',
        );
    }

    public function show(Request $request, Accounts $account): JsonResponse
    {
        $this->assertCompanyResource($request, $account);

        return ApiResponse::success(
            new AccountResource($account->load(['parent', 'children'])),
            'Cuenta obtenida correctamente.',
        );
    }

    public function update(StoreAccountRequest $request, Accounts $account): JsonResponse
    {
        $this->assertCompanyResource($request, $account);
        $account->update($request->validated());

        return ApiResponse::success(
            new AccountResource($account->fresh(['parent', 'children'])),
            'Cuenta actualizada correctamente.',
        );
    }

    public function destroy(Request $request, Accounts $account): JsonResponse
    {
        $this->assertCompanyResource($request, $account);
        $account->delete();

        return ApiResponse::success(null, 'Cuenta eliminada correctamente.');
    }
}
