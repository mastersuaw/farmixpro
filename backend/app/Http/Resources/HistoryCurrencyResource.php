<?php

namespace App\Http\Resources;

use App\Models\HistoryCurrencies;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HistoryCurrencies
 */
class HistoryCurrencyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'monedas_id' => $this->monedas_id,
            'tasa' => $this->tasa,
            'fecha' => $this->fecha?->toDateString(),
            'currency' => new CurrencyResource($this->whenLoaded('currency')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
