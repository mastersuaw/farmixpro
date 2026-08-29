<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariantProductChannelRequest;
use App\Http\Resources\VariantProductChannelResource;
use App\Models\VariantsProductsChannels;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VariantProductChannelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = $this->forCompany($request, VariantsProductsChannels::class)
            ->with(['variant', 'channel'])
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($rows, VariantProductChannelResource::class, 'Precios por canal obtenidos correctamente.');
    }

    public function store(StoreVariantProductChannelRequest $request): JsonResponse
    {
        $data = $this->withCompany($request, $request->safe()->except('is_available'));
        $row = VariantsProductsChannels::query()->create($data);

        return ApiResponse::created(
            new VariantProductChannelResource($row->load(['variant', 'channel'])),
            'Precio de canal creado correctamente.',
        );
    }

    public function show(Request $request, VariantsProductsChannels $variantChannel): JsonResponse
    {
        $this->assertCompanyResource($request, $variantChannel);

        return ApiResponse::success(
            new VariantProductChannelResource($variantChannel->load(['variant', 'channel'])),
            'Precio de canal obtenido correctamente.',
        );
    }

    public function update(StoreVariantProductChannelRequest $request, VariantsProductsChannels $variantChannel): JsonResponse
    {
        $this->assertCompanyResource($request, $variantChannel);
        $variantChannel->update($request->safe()->except('is_available'));

        return ApiResponse::success(
            new VariantProductChannelResource($variantChannel->fresh(['variant', 'channel'])),
            'Precio de canal actualizado correctamente.',
        );
    }

    public function destroy(Request $request, VariantsProductsChannels $variantChannel): JsonResponse
    {
        $this->assertCompanyResource($request, $variantChannel);
        $variantChannel->delete();

        return ApiResponse::success(null, 'Precio de canal eliminado correctamente.');
    }
}
