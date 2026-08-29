<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['companies_id', 'variants_products_id', 'name', 'value'])]
class VariantsProductsAttributes extends Model
{
    use HasFactory;

    protected $table = 'variants_products_attributes';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function variantsProducts(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_products_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_products_id');
    }
}
