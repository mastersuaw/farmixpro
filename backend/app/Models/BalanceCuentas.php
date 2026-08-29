<?php

namespace App\Models;

use App\Enums\TipoReferencia;
use Database\Factories\BalanceCuentasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'companies_id',
    'cuentas_id',
    'referencia',
    'tipo_referencia',
    'debito',
    'credito',
    'fecha',
])]
class BalanceCuentas extends Model
{
    /** @use HasFactory<BalanceCuentasFactory> */
    use HasFactory;

    protected $table = 'balance_cuentas';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tipo_referencia' => TipoReferencia::class,
            'debito' => 'float',
            'credito' => 'float',
            'fecha' => 'datetime',
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

    public function accounts(): BelongsTo
    {
        return $this->belongsTo(Accounts::class, 'cuentas_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Accounts::class, 'cuentas_id');
    }
}
