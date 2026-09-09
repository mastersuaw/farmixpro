<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Products;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index()
    {
        $products = Products::with('variants')->get();

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Products::create([
            'companies_id' => $request->user()->current_company_id,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
        ]);

        return new ProductResource($product);
    }

    public function show(Products $product)
    {
        $product->load('variants');

        return new ProductResource($product);
    }

    public function update(StoreProductRequest $request, Products $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->fresh());
    }

    public function destroy(Products $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente.'
        ]);
    }
}