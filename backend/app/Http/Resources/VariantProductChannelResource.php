<?php

namespace App\Http\Resources;

use App\Models\VariantsProductsChannels;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin VariantsProductsChannels
 */
class VariantProductChannelResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'companies_id' => $this->companies_id,
            'variants_products_id' => $this->variants_products_id,
            'channels_id' => $this->channels_id,
            'price' => $this->price,
            'stock' => $this->stock,
            'is_avaliable' => (bool) $this->is_avaliable,
            'is_available' => (bool) $this->is_avaliable,
            'variant' => new VariantProductResource($this->whenLoaded('variant')),
            'channel' => new ChannelResource($this->whenLoaded('channel')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
