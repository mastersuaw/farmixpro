<?php

namespace App\Http\Resources;

use App\Models\InvocesTaxes;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InvocesTaxes
 */
class InvoiceTaxResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'facturas_id' => $this->facturas_id,
            'impuestos_id' => $this->impuestos_id,
            'tax' => new TaxResource($this->whenLoaded('tax')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
