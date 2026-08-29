<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCurrencyRequest;
use App\Http\Resources\CurrencyResource;
use App\Models\Currencies;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $currencies = Currencies::query()
            ->with('historyCurrencies')
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($currencies, CurrencyResource::class, 'Monedas obtenidas correctamente.');
    }

    public function store(StoreCurrencyRequest $request): JsonResponse
    {
        $currency = Currencies::query()->create($request->validated());

        return ApiResponse::created(new CurrencyResource($currency), 'Moneda creada correctamente.');
    }

    public function show(Currencies $currency): JsonResponse
    {
        return ApiResponse::success(
            new CurrencyResource($currency->load('historyCurrencies')),
            'Moneda obtenida correctamente.',
        );
    }

    public function update(StoreCurrencyRequest $request, Currencies $currency): JsonResponse
    {
        $currency->update($request->validated());

        return ApiResponse::success(
            new CurrencyResource($currency->fresh('historyCurrencies')),
            'Moneda actualizada correctamente.',
        );
    }

    public function destroy(Currencies $currency): JsonResponse
    {
        $currency->delete();

        return ApiResponse::success(null, 'Moneda eliminada correctamente.');
    }
}
