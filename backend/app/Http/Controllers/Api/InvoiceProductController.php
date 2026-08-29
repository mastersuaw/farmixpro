<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceProductRequest;
use App\Http\Resources\InvoiceProductResource;
use App\Models\InvocesProducts;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $lines = $this->forCompany($request, InvocesProducts::class)
            ->with('variant')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($lines, InvoiceProductResource::class, 'Líneas de factura obtenidas correctamente.');
    }

    public function store(StoreInvoiceProductRequest $request): JsonResponse
    {
        $data = $this->withCompany($request, $request->validated());
        $data['users_id'] = $request->user()->id;
        $line = InvocesProducts::query()->create($data);

        return ApiResponse::created(
            new InvoiceProductResource($line->load('variant')),
            'Línea de factura creada correctamente.',
        );
    }

    public function show(Request $request, InvocesProducts $invoiceProduct): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceProduct);

        return ApiResponse::success(
            new InvoiceProductResource($invoiceProduct->load('variant')),
            'Línea de factura obtenida correctamente.',
        );
    }

    public function update(StoreInvoiceProductRequest $request, InvocesProducts $invoiceProduct): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceProduct);
        $invoiceProduct->update($request->validated());

        return ApiResponse::success(
            new InvoiceProductResource($invoiceProduct->fresh('variant')),
            'Línea de factura actualizada correctamente.',
        );
    }

    public function destroy(Request $request, InvocesProducts $invoiceProduct): JsonResponse
    {
        $this->assertCompanyResource($request, $invoiceProduct);
        $invoiceProduct->delete();

        return ApiResponse::success(null, 'Línea de factura eliminada correctamente.');
    }
}
