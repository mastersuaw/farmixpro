<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customers;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $customers = $this->forCompany($request, Customers::class)
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($customers, CustomerResource::class, 'Clientes obtenidos correctamente.');
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = Customers::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new CustomerResource($customer), 'Cliente creado correctamente.');
    }

    public function show(Request $request, Customers $customer): JsonResponse
    {
        $this->assertCompanyResource($request, $customer);

        return ApiResponse::success(new CustomerResource($customer), 'Cliente obtenido correctamente.');
    }

    public function update(StoreCustomerRequest $request, Customers $customer): JsonResponse
    {
        $this->assertCompanyResource($request, $customer);
        $customer->update($request->validated());

        return ApiResponse::success(new CustomerResource($customer->fresh()), 'Cliente actualizado correctamente.');
    }

    public function destroy(Request $request, Customers $customer): JsonResponse
    {
        $this->assertCompanyResource($request, $customer);
        $customer->delete();

        return ApiResponse::success(null, 'Cliente eliminado correctamente.');
    }
}
