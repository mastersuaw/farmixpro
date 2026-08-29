<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'companies_id',
    'variants_products_id',
    'channels_id',
    'price',
    'stock',
    'is_avaliable',
])]
class VariantsProductsChannels extends Model
{
    use HasFactory;

    protected $table = 'variants_products_channels';

    protected $appends = ['is_available'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'float',
            'stock' => 'float',
            'is_avaliable' => 'boolean',
        ];
    }

    /**
     * API alias for the diagram column `is_avaliable`.
     *
     * @return Attribute<bool, bool>
     */
    protected function isAvailable(): Attribute
    {
        return Attribute::make(
            get: fn (): bool => (bool) $this->is_avaliable,
            set: fn (mixed $value): array => ['is_avaliable' => (bool) $value],
        );
    }

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function variantsProducts(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_products_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(VariantsProducts::class, 'variants_products_id');
    }

    public function channels(): BelongsTo
    {
        return $this->belongsTo(Channels::class, 'channels_id');
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channels::class, 'channels_id');
    }
}
