<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = [
        'cliente_id',
        'nombre_cuenta',
        'numero_cuenta',
        'balance',
        'tipo_cuenta',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}