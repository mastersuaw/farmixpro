<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChannelRequest;
use App\Http\Resources\ChannelResource;
use App\Models\Channels;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $channels = $this->forCompany($request, Channels::class)
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($channels, ChannelResource::class, 'Canales obtenidos correctamente.');
    }

    public function store(StoreChannelRequest $request): JsonResponse
    {
        $channel = Channels::query()->create($this->withCompany($request, $request->validated()));

        return ApiResponse::created(new ChannelResource($channel), 'Canal creado correctamente.');
    }

    public function show(Request $request, Channels $channel): JsonResponse
    {
        $this->assertCompanyResource($request, $channel);

        return ApiResponse::success(new ChannelResource($channel), 'Canal obtenido correctamente.');
    }

    public function update(StoreChannelRequest $request, Channels $channel): JsonResponse
    {
        $this->assertCompanyResource($request, $channel);
        $channel->update($request->validated());

        return ApiResponse::success(new ChannelResource($channel->fresh()), 'Canal actualizado correctamente.');
    }

    public function destroy(Request $request, Channels $channel): JsonResponse
    {
        $this->assertCompanyResource($request, $channel);
        $channel->delete();

        return ApiResponse::success(null, 'Canal eliminado correctamente.');
    }
}
