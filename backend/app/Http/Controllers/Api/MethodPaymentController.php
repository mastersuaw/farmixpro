<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMethodPaymentRequest;
use App\Http\Resources\MethodPaymentResource;
use App\Models\MethodsPayments;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MethodPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $methods = $this->forCompany($request, MethodsPayments::class)
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($methods, MethodPaymentResource::class, 'Métodos de pago obtenidos correctamente.');
    }

    public function store(StoreMethodPaymentRequest $request): JsonResponse
    {
        $method = MethodsPayments::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new MethodPaymentResource($method), 'Método de pago creado correctamente.');
    }

    public function show(Request $request, MethodsPayments $methodPayment): JsonResponse
    {
        $this->assertCompanyResource($request, $methodPayment);

        return ApiResponse::success(new MethodPaymentResource($methodPayment), 'Método de pago obtenido correctamente.');
    }

    public function update(StoreMethodPaymentRequest $request, MethodsPayments $methodPayment): JsonResponse
    {
        $this->assertCompanyResource($request, $methodPayment);
        $methodPayment->update($request->validated());

        return ApiResponse::success(new MethodPaymentResource($methodPayment->fresh()), 'Método de pago actualizado correctamente.');
    }

    public function destroy(Request $request, MethodsPayments $methodPayment): JsonResponse
    {
        $this->assertCompanyResource($request, $methodPayment);
        $methodPayment->delete();

        return ApiResponse::success(null, 'Método de pago eliminado correctamente.');
    }
}
