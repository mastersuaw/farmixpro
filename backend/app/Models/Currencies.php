<?php

namespace App\Models;

use Database\Factories\CurrenciesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['codigo', 'nombre', 'tasa'])]
class Currencies extends Model
{
    /** @use HasFactory<CurrenciesFactory> */
    use HasFactory;

    protected $table = 'currencies';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tasa' => 'float',
        ];
    }

    public function historyCurrencies(): HasMany
    {
        return $this->hasMany(HistoryCurrencies::class, 'monedas_id');
    }
}
