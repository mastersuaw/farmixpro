<?php

namespace App\Http\Resources;

use App\Models\Invoices;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Invoices
 */
class InvoiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'who_open' => $this->who_open,
            'who_close' => $this->who_close,
            'clientes_id' => $this->clientes_id,
            'fecha' => $this->fecha?->toDateString(),
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'status' => $this->status?->value ?? $this->status,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'opener' => new UserResource($this->whenLoaded('opener')),
            'closer' => new UserResource($this->whenLoaded('closer')),
            'products' => InvoiceProductResource::collection($this->whenLoaded('invocesProducts')),
            'taxes' => InvoiceTaxResource::collection($this->whenLoaded('invocesTaxes')),
            'payments' => HowPaidResource::collection($this->whenLoaded('howPaid')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
