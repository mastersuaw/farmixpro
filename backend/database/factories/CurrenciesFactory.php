<?php

namespace Database\Factories;

use App\Models\Currencies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Currencies>
 */
class CurrenciesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'codigo' => fake()->unique()->currencyCode(),
            'nombre' => fake()->currencyCode().' '.fake()->word(),
            'tasa' => fake()->randomFloat(4, 0.5, 5000),
        ];
    }
}
