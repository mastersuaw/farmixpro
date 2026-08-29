<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariantProductAttributeRequest;
use App\Http\Resources\VariantProductAttributeResource;
use App\Models\VariantsProductsAttributes;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VariantProductAttributeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $attributes = $this->forCompany($request, VariantsProductsAttributes::class)
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($attributes, VariantProductAttributeResource::class, 'Atributos obtenidos correctamente.');
    }

    public function store(StoreVariantProductAttributeRequest $request): JsonResponse
    {
        $attribute = VariantsProductsAttributes::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new VariantProductAttributeResource($attribute), 'Atributo creado correctamente.');
    }

    public function show(Request $request, VariantsProductsAttributes $attribute): JsonResponse
    {
        $this->assertCompanyResource($request, $attribute);

        return ApiResponse::success(new VariantProductAttributeResource($attribute), 'Atributo obtenido correctamente.');
    }

    public function update(StoreVariantProductAttributeRequest $request, VariantsProductsAttributes $attribute): JsonResponse
    {
        $this->assertCompanyResource($request, $attribute);
        $attribute->update($request->validated());

        return ApiResponse::success(new VariantProductAttributeResource($attribute->fresh()), 'Atributo actualizado correctamente.');
    }

    public function destroy(Request $request, VariantsProductsAttributes $attribute): JsonResponse
    {
        $this->assertCompanyResource($request, $attribute);
        $attribute->delete();

        return ApiResponse::success(null, 'Atributo eliminado correctamente.');
    }
}
