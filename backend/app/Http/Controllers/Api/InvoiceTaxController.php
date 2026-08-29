<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceTaxRequest;
use App\Http\Resources\InvoiceTaxResource;
use App\Models\InvocesTaxes;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceTaxController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = $this->forCompany($request, InvocesTaxes::class)
            ->with('tax')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($rows, InvoiceTaxResource::class, 'Impuestos de factura obtenidos correctamente.');
    }

    public function store(StoreInvoiceTaxRequest $request): JsonResponse
    {
        $row = InvocesTaxes::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new InvoiceTaxResource($row->load('tax')), 'Impuesto de factura creado correctamente.');
    }

    public function show(Request $request, InvocesTaxes $invoiceTax): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceTax);

        return ApiResponse::success(new InvoiceTaxResource($invoiceTax->load('tax')), 'Impuesto de factura obtenido correctamente.');
    }

    public function update(StoreInvoiceTaxRequest $request, InvocesTaxes $invoiceTax): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceTax);
        $invoiceTax->update($request->validated());

        return ApiResponse::success(new InvoiceTaxResource($invoiceTax->fresh('tax')), 'Impuesto de factura actualizado correctamente.');
    }

    public function destroy(Request $request, InvocesTaxes $invoiceTax): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceTax);
        $invoiceTax->delete();

        return ApiResponse::success(null, 'Impuesto de factura eliminado correctamente.');
    }
}
