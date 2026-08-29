<?php

namespace App\Models;

use Database\Factories\AccountsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'parent_id', 'nombre', 'codigo', 'descripcion'])]
class Accounts extends Model
{
    /** @use HasFactory<AccountsFactory> */
    use HasFactory;

    protected $table = 'accounts';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function balanceCuentas(): HasMany
    {
        return $this->hasMany(BalanceCuentas::class, 'cuentas_id');
    }
}
