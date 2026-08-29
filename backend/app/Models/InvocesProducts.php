<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'companies_id',
    'users_id',
    'facturas_id',
    'variants_id',
    'cantidad',
    'precio',
    'descuento',
])]
class InvocesProducts extends Model
{
    use HasFactory;

    protected $table = 'invoces_products';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cantidad' => 'float',
            'precio' => 'float',
            'descuento' => 'float',
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

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function invoices(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function variantsProducts(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_id');
    }
}
