<?php

namespace App\Http\Resources;

use App\Models\HowPaid;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HowPaid
 */
class HowPaidResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'metodos_pagos_id' => $this->metodos_pagos_id,
            'facturas_id' => $this->facturas_id,
            'monedas_id' => $this->monedas_id,
            'amount' => $this->amount,
            'discount' => $this->discount,
            'rate' => $this->rate,
            'method_payment' => new MethodPaymentResource($this->whenLoaded('methodPayment')),
            'history_currency' => new HistoryCurrencyResource($this->whenLoaded('historyCurrencies')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
