<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'companies_id',
    'metodos_pagos_id',
    'facturas_id',
    'monedas_id',
    'amount',
    'discount',
    'rate',
])]
class HowPaid extends Model
{
    use HasFactory;

    protected $table = 'how_paid';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'discount' => 'float',
            'rate' => 'float',
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

    public function methodsPayments(): BelongsTo
    {
        return $this->belongsTo(MethodsPayments::class, 'metodos_pagos_id');
    }

    public function methodPayment(): BelongsTo
    {
        return $this->belongsTo(MethodsPayments::class, 'metodos_pagos_id');
    }

    public function invoices(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function historyCurrencies(): BelongsTo
    {
        return $this->belongsTo(HistoryCurrencies::class, 'monedas_id');
    }
}
