<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBalanceCuentaRequest;
use App\Http\Resources\BalanceCuentaResource;
use App\Models\BalanceCuentas;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BalanceCuentaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = $this->forCompany($request, BalanceCuentas::class)
            ->with('account')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($rows, BalanceCuentaResource::class, 'Movimientos de cuenta obtenidos correctamente.');
    }

    public function store(StoreBalanceCuentaRequest $request): JsonResponse
    {
        $row = BalanceCuentas::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(
            new BalanceCuentaResource($row->load('account')),
            'Movimiento de cuenta creado correctamente.',
        );
    }

    public function show(Request $request, BalanceCuentas $balanceCuenta): JsonResponse
    {
        $this->assertCompanyResource($request, $balanceCuenta);

        return ApiResponse::success(
            new BalanceCuentaResource($balanceCuenta->load('account')),
            'Movimiento de cuenta obtenido correctamente.',
        );
    }

    public function update(StoreBalanceCuentaRequest $request, BalanceCuentas $balanceCuenta): JsonResponse
    {
        $this->assertCompanyResource($request, $balanceCuenta);
        $balanceCuenta->update($request->validated());

        return ApiResponse::success(
            new BalanceCuentaResource($balanceCuenta->fresh('account')),
            'Movimiento de cuenta actualizado correctamente.',
        );
    }

    public function destroy(Request $request, BalanceCuentas $balanceCuenta): JsonResponse
    {
        $this->assertCompanyResource($request, $balanceCuenta);
        $balanceCuenta->delete();

        return ApiResponse::success(null, 'Movimiento de cuenta eliminado correctamente.');
    }
}
