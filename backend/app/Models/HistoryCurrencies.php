<?php

namespace App\Models;

use Database\Factories\HistoryCurrenciesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['monedas_id', 'tasa', 'fecha'])]
class HistoryCurrencies extends Model
{
    /** @use HasFactory<HistoryCurrenciesFactory> */
    use HasFactory;

    protected $table = 'history_currencies';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tasa' => 'float',
            'fecha' => 'date',
        ];
    }

    public function currencies(): BelongsTo
    {
        return $this->belongsTo(Currencies::class, 'monedas_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currencies::class, 'monedas_id');
    }

    public function howPaid(): HasMany
    {
        return $this->hasMany(HowPaid::class, 'monedas_id');
    }
}
