<?php

namespace Database\Factories;

use App\Models\Channels;
use App\Models\Companies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Channels>
 */
class ChannelsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'name' => fake()->randomElement(['POS', 'Online', 'Mayorista']),
            'description' => fake()->sentence(),
        ];
    }
}
