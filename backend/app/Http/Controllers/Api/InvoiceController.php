<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoices;
use App\Services\InvoiceWriter;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(private readonly InvoiceWriter $writer) {}

    public function index(Request $request): JsonResponse
    {
        $invoices = $this->forCompany($request, Invoices::class)
            ->with($this->writer->relations())
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($invoices, InvoiceResource::class, 'Facturas obtenidas correctamente.');
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->writer->create(
            $request->validated(),
            $this->currentCompanyId($request),
            (int) $request->user()->id,
        );

        return ApiResponse::created(new InvoiceResource($invoice), 'Factura creada correctamente.');
    }

    public function show(Request $request, Invoices $invoice): JsonResponse
    {
        $this->assertCompanyResource($request, $invoice);

        return ApiResponse::success(
            new InvoiceResource($invoice->load($this->writer->relations())),
            'Factura obtenida correctamente.',
        );
    }

    public function update(StoreInvoiceRequest $request, Invoices $invoice): JsonResponse
    {
        $this->assertCompanyResource($request, $invoice);

        $invoice = $this->writer->update(
            $invoice,
            $request->validated(),
            $this->currentCompanyId($request),
            (int) $request->user()->id,
        );

        return ApiResponse::success(new InvoiceResource($invoice), 'Factura actualizada correctamente.');
    }

    public function destroy(Request $request, Invoices $invoice): JsonResponse
    {
        $this->assertCompanyResource($request, $invoice);
        $invoice->delete();

        return ApiResponse::success(null, 'Factura eliminada correctamente.');
    }
}
