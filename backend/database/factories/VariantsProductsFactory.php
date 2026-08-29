<?php

namespace Database\Factories;

use App\Models\Companies;
use App\Models\Products;
use App\Models\VariantsProducts;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VariantsProducts>
 */
class VariantsProductsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'products_id' => Products::factory(),
            'sku' => fake()->unique()->bothify('SKU-####'),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'stock' => fake()->randomFloat(2, 0, 500),
        ];
    }
}
