<?php

namespace App\Models;

use Database\Factories\TaxesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'nombre', 'descripcion', 'tasa'])]
class Taxes extends Model
{
    /** @use HasFactory<TaxesFactory> */
    use HasFactory;

    protected $table = 'taxes';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tasa' => 'float',
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

    public function invocesTaxes(): HasMany
    {
        return $this->hasMany(InvocesTaxes::class, 'impuestos_id');
    }
}
