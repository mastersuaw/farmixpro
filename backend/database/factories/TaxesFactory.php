<?php

namespace Database\Factories;

use App\Models\Companies;
use App\Models\Taxes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Taxes>
 */
class TaxesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'nombre' => 'IVA '.fake()->randomElement(['19%', '5%', '0%']),
            'descripcion' => fake()->sentence(),
            'tasa' => fake()->randomElement([19, 5, 0]),
        ];
    }
}
