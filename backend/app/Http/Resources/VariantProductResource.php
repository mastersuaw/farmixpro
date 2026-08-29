<?php

namespace App\Http\Resources;

use App\Models\VariantsProducts;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin VariantsProducts
 */
class VariantProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'products_id' => $this->products_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'stock' => $this->stock,
            'product' => new ProductResource($this->whenLoaded('product')),
            'attributes' => VariantProductAttributeResource::collection($this->whenLoaded('attributes')),
            'channels' => VariantProductChannelResource::collection($this->whenLoaded('variantsProductsChannels')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
