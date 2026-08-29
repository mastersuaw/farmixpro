<?php

namespace Database\Factories;

use App\Models\Currencies;
use App\Models\HistoryCurrencies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HistoryCurrencies>
 */
class HistoryCurrenciesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'monedas_id' => Currencies::factory(),
            'tasa' => fake()->randomFloat(4, 0.5, 5000),
            'fecha' => fake()->date(),
        ];
    }
}
