<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Products;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = $this->forCompany($request, Products::class)
            ->with('variants')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($products, ProductResource::class, 'Productos obtenidos correctamente.');
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Products::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(
            new ProductResource($product->load('variants')),
            'Producto creado correctamente.',
        );
    }

    public function show(Request $request, Products $product): JsonResponse
    {
        $this->assertCompanyResource($request, $product);

        return ApiResponse::success(
            new ProductResource($product->load('variants.attributes')),
            'Producto obtenido correctamente.',
        );
    }

    public function update(StoreProductRequest $request, Products $product): JsonResponse
    {
        $this->assertCompanyResource($request, $product);
        $product->update($request->validated());

        return ApiResponse::success(
            new ProductResource($product->fresh('variants')),
            'Producto actualizado correctamente.',
        );
    }

    public function destroy(Request $request, Products $product): JsonResponse
    {
        $this->assertCompanyResource($request, $product);
        $product->delete();

        return ApiResponse::success(null, 'Producto eliminado correctamente.');
    }
}
