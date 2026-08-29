<?php

namespace App\Http\Resources;

use App\Models\Taxes;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Taxes
 */
class TaxResource extends JsonResource
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
            'descripcion' => $this->descripcion,
            'tasa' => $this->tasa,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
