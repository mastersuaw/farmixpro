<?php

namespace App\Http\Resources;

use App\Models\BalanceCuentas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin BalanceCuentas
 */
class BalanceCuentaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'cuentas_id' => $this->cuentas_id,
            'referencia' => $this->referencia,
            'tipo_referencia' => $this->tipo_referencia?->value ?? $this->tipo_referencia,
            'debito' => $this->debito,
            'credito' => $this->credito,
            'fecha' => $this->fecha,
            'account' => new AccountResource($this->whenLoaded('account')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
