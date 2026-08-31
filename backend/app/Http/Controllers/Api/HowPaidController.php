<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHowPaidRequest;
use App\Http\Resources\HowPaidResource;
use App\Models\HowPaid;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HowPaidController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = $this->forCompany($request, HowPaid::class)
            ->with(['methodPayment'])
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($rows, HowPaidResource::class, 'Pagos obtenidos correctamente.');
    }

    public function store(StoreHowPaidRequest $request): JsonResponse
    {
        $row = HowPaid::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(
            new HowPaidResource($row->load(['methodPayment'])),
            'Pago registrado correctamente.',
        );
    }

    public function show(Request $request, HowPaid $howPaid): JsonResponse
    {
        $this->assertCompanyResource($request, $howPaid);

        return ApiResponse::success(
            new HowPaidResource($howPaid->load(['methodPayment'])),
            'Pago obtenido correctamente.',
        );
    }

    public function update(StoreHowPaidRequest $request, HowPaid $howPaid): JsonResponse
    {
        $this->assertCompanyResource($request, $howPaid);
        $howPaid->update($request->validated());

        return ApiResponse::success(
            new HowPaidResource($howPaid->fresh(['methodPayment'])),
            'Pago actualizado correctamente.',
        );
    }

    public function destroy(Request $request, HowPaid $howPaid): JsonResponse
    {
        $this->assertCompanyResource($request, $howPaid);
        $howPaid->delete();

        return ApiResponse::success(null, 'Pago eliminado correctamente.');
    }
}
