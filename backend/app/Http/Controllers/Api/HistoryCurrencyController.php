<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHistoryCurrencyRequest;
use App\Http\Resources\HistoryCurrencyResource;
use App\Models\HistoryCurrencies;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistoryCurrencyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $history = HistoryCurrencies::query()
            ->with('currency')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($history, HistoryCurrencyResource::class, 'Historial de monedas obtenido correctamente.');
    }

    public function store(StoreHistoryCurrencyRequest $request): JsonResponse
    {
        $history = HistoryCurrencies::query()->create($request->validated());

        return ApiResponse::created(
            new HistoryCurrencyResource($history->load('currency')),
            'Tasa histórica creada correctamente.',
        );
    }

    public function show(HistoryCurrencies $historyCurrency): JsonResponse
    {
        return ApiResponse::success(
            new HistoryCurrencyResource($historyCurrency->load('currency')),
            'Tasa histórica obtenida correctamente.',
        );
    }

    public function update(StoreHistoryCurrencyRequest $request, HistoryCurrencies $historyCurrency): JsonResponse
    {
        $historyCurrency->update($request->validated());

        return ApiResponse::success(
            new HistoryCurrencyResource($historyCurrency->fresh('currency')),
            'Tasa histórica actualizada correctamente.',
        );
    }

    public function destroy(HistoryCurrencies $historyCurrency): JsonResponse
    {
        $historyCurrency->delete();

        return ApiResponse::success(null, 'Tasa histórica eliminada correctamente.');
    }
}
