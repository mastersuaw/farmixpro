<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaxRequest;
use App\Http\Resources\TaxResource;
use App\Models\Taxes;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $taxes = $this->forCompany($request, Taxes::class)
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($taxes, TaxResource::class, 'Impuestos obtenidos correctamente.');
    }

    public function store(StoreTaxRequest $request): JsonResponse
    {
        $tax = Taxes::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new TaxResource($tax), 'Impuesto creado correctamente.');
    }

    public function show(Request $request, Taxes $tax): JsonResponse
    {
        $this->assertCompanyResource($request, $tax);

        return ApiResponse::success(new TaxResource($tax), 'Impuesto obtenido correctamente.');
    }

    public function update(StoreTaxRequest $request, Taxes $tax): JsonResponse
    {
        $this->assertCompanyResource($request, $tax);
        $tax->update($request->validated());

        return ApiResponse::success(new TaxResource($tax->fresh()), 'Impuesto actualizado correctamente.');
    }

    public function destroy(Request $request, Taxes $tax): JsonResponse
    {
        $this->assertCompanyResource($request, $tax);
        $tax->delete();

        return ApiResponse::success(null, 'Impuesto eliminado correctamente.');
    }
}
