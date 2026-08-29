<?php

namespace Database\Factories;

use App\Models\Companies;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Products>
 */
class ProductsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'nombre' => fake()->words(3, true),
            'descripcion' => fake()->sentence(),
            'precio' => fake()->randomFloat(2, 1000, 100000),
        ];
    }
}
