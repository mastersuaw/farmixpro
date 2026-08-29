<?php

namespace Database\Factories;

use App\Models\Companies;
use App\Models\Customers;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customers>
 */
class CustomersFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'nombre' => fake()->name(),
            'card_id' => fake()->unique()->numerify('##########'),
            'direccion' => fake()->address(),
            'telefono' => fake()->numerify('3#########'),
        ];
    }
}
