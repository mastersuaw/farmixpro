<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Database\Factories\InvoicesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'companies_id',
    'who_open',
    'who_close',
    'fecha',
    'total',
    'subtotal',
    'status',
])]
class Invoices extends Model
{
    /** @use HasFactory<InvoicesFactory> */
    use HasFactory;

    protected $table = 'invoices';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'total' => 'float',
            'subtotal' => 'float',
            'status' => InvoiceStatus::class,
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

    public function opener(): BelongsTo
    {
        return $this->belongsTo(User::class, 'who_open');
    }

    public function closer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'who_close');
    }

    public function invocesProducts(): HasMany
    {
        return $this->hasMany(InvocesProducts::class, 'facturas_id');
    }

    public function invocesTaxes(): HasMany
    {
        return $this->hasMany(InvocesTaxes::class, 'facturas_id');
    }

    public function howPaid(): HasMany
    {
        return $this->hasMany(HowPaid::class, 'facturas_id');
    }
}
