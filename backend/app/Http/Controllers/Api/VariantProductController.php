<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariantProductRequest;
use App\Http\Resources\VariantProductResource;
use App\Models\VariantsProducts;
use App\Models\VariantsProductsAttributes;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VariantProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $variants = $this->forCompany($request, VariantsProducts::class)
            ->with(['product', 'attributes', 'variantsProductsChannels'])
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($variants, VariantProductResource::class, 'Variantes obtenidas correctamente.');
    }

    public function store(StoreVariantProductRequest $request): JsonResponse
    {
        $data = $this->withCompany($request, $request->safe()->except('attributes'));
        $variant = VariantsProducts::query()->create($data);
        $this->syncAttributes($variant, $request->input('attributes'), $this->currentCompanyId($request));

        return ApiResponse::created(
            new VariantProductResource($variant->load(['product', 'attributes', 'variantsProductsChannels'])),
            'Variante creada correctamente.',
        );
    }

    public function show(Request $request, VariantsProducts $variant): JsonResponse
    {
        $this->assertCompanyResource($request, $variant);

        return ApiResponse::success(
            new VariantProductResource($variant->load(['product', 'attributes', 'variantsProductsChannels'])),
            'Variante obtenida correctamente.',
        );
    }

    public function update(StoreVariantProductRequest $request, VariantsProducts $variant): JsonResponse
    {
        $this->assertCompanyResource($request, $variant);
        $variant->update($request->safe()->except('attributes'));

        if ($request->exists('attributes')) {
            $this->syncAttributes($variant, $request->input('attributes'), $this->currentCompanyId($request));
        }

        return ApiResponse::success(
            new VariantProductResource($variant->fresh(['product', 'attributes', 'variantsProductsChannels'])),
            'Variante actualizada correctamente.',
        );
    }

    public function destroy(Request $request, VariantsProducts $variant): JsonResponse
    {
        $this->assertCompanyResource($request, $variant);
        $variant->delete();

        return ApiResponse::success(null, 'Variante eliminada correctamente.');
    }

    /**
     * @param  array<int, array<string, mixed>>|null  $attributes
     */
    private function syncAttributes(VariantsProducts $variant, ?array $attributes, int $companyId): void
    {
        if ($attributes === null) {
            return;
        }

        $keepIds = [];

        foreach ($attributes as $attribute) {
            $payload = [
                'companies_id' => $companyId,
                'variants_products_id' => $variant->id,
                'name' => $attribute['name'],
                'value' => $attribute['value'],
            ];

            if (! empty($attribute['id'])) {
                $model = VariantsProductsAttributes::query()
                    ->where('companies_id', $companyId)
                    ->where('variants_products_id', $variant->id)
                    ->findOrFail($attribute['id']);
                $model->update($payload);
            } else {
                $model = VariantsProductsAttributes::query()->create($payload);
            }

            $keepIds[] = $model->id;
        }

        $variant->attributes()->whereNotIn('id', $keepIds)->delete();
    }
}
