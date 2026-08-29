<?php

namespace App\Models;

use Database\Factories\MethodsPaymentsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'nombre'])]
class MethodsPayments extends Model
{
    /** @use HasFactory<MethodsPaymentsFactory> */
    use HasFactory;

    protected $table = 'methods_payments';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function howPaid(): HasMany
    {
        return $this->hasMany(HowPaid::class, 'metodos_pagos_id');
    }
}
