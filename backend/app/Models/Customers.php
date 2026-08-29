<?php

namespace App\Models;

use Database\Factories\CustomersFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'nombre', 'card_id', 'direccion', 'telefono'])]
class Customers extends Model
{
    /** @use HasFactory<CustomersFactory> */
    use HasFactory;

    protected $table = 'customers';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoices::class, 'clientes_id');
    }
}
