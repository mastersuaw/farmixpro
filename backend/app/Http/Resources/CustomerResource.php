<?php

namespace App\Http\Resources;

use App\Models\Customers;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Customers
 */
class CustomerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'nombre' => $this->nombre,
            'card_id' => $this->card_id,
            'direccion' => $this->direccion,
            'telefono' => $this->telefono,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
