<?php

namespace Database\Factories;

use App\Enums\TipoReferencia;
use App\Models\Accounts;
use App\Models\BalanceCuentas;
use App\Models\Companies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BalanceCuentas>
 */
class BalanceCuentasFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'cuentas_id' => Accounts::factory(),
            'referencia' => fake()->bothify('REF-####'),
            'tipo_referencia' => fake()->randomElement(TipoReferencia::cases()),
            'debito' => fake()->randomFloat(2, 0, 100000),
            'credito' => 0,
            'fecha' => now(),
        ];
    }
}
