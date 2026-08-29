<?php

namespace App\Http\Resources;

use App\Models\InvocesProducts;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InvocesProducts
 */
class InvoiceProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'users_id' => $this->users_id,
            'facturas_id' => $this->facturas_id,
            'variants_id' => $this->variants_id,
            'cantidad' => $this->cantidad,
            'precio' => $this->precio,
            'descuento' => $this->descuento,
            'variant' => new VariantProductResource($this->whenLoaded('variant')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
