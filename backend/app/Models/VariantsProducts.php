<?php

namespace App\Models;

use Database\Factories\VariantsProductsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'products_id', 'sku', 'name', 'description', 'stock'])]
class VariantsProducts extends Model
{
    /** @use HasFactory<VariantsProductsFactory> */
    use HasFactory;

    protected $table = 'variants_products';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stock' => 'float',
        ];
    }

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'products_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'products_id');
    }

    public function variantsProductsAttributes(): HasMany
    {
        return $this->hasMany(VariantsProductsAttributes::class, 'variants_products_id');
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(VariantsProductsAttributes::class, 'variants_products_id');
    }

    public function variantsProductsChannels(): HasMany
    {
        return $this->hasMany(VariantsProductsChannels::class, 'variants_products_id');
    }

    public function invocesProducts(): HasMany
    {
        return $this->hasMany(InvocesProducts::class, 'variants_id');
    }
}
