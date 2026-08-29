<?php

namespace App\Models;

use Database\Factories\ProductsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'nombre', 'descripcion', 'precio'])]
class Products extends Model
{
    /** @use HasFactory<ProductsFactory> */
    use HasFactory;

    protected $table = 'products';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'precio' => 'float',
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

    public function variantsProducts(): HasMany
    {
        return $this->hasMany(VariantsProducts::class, 'products_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(VariantsProducts::class, 'products_id');
    }
}
