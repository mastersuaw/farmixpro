<?php

namespace Database\Factories;

use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Accounts>
 */
class AccountsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'parent_id' => null,
            'nombre' => fake()->words(2, true),
            'codigo' => fake()->unique()->bothify('ACC-###'),
            'descripcion' => fake()->sentence(),
        ];
    }
}
