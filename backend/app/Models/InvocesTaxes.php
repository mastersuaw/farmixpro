<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['companies_id', 'facturas_id', 'impuestos_id'])]
class InvocesTaxes extends Model
{
    use HasFactory;

    protected $table = 'invoces_taxes';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function invoices(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoices::class, 'facturas_id');
    }

    public function taxes(): BelongsTo
    {
        return $this->belongsTo(Taxes::class, 'impuestos_id');
    }

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Taxes::class, 'impuestos_id');
    }
}
