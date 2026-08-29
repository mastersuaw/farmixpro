<?php

namespace App\Models;

use Database\Factories\ChannelsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['companies_id', 'name', 'description'])]
class Channels extends Model
{
    /** @use HasFactory<ChannelsFactory> */
    use HasFactory;

    protected $table = 'channels';

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'companies_id');
    }

    public function variantsProductsChannels(): HasMany
    {
        return $this->hasMany(VariantsProductsChannels::class, 'channels_id');
    }
}
