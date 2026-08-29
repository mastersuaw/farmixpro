<?php

namespace Database\Factories;

use App\Models\Companies;
use App\Models\MethodsPayments;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MethodsPayments>
 */
class MethodsPaymentsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'nombre' => fake()->randomElement(['Efectivo', 'Transferencia', 'Tarjeta']),
        ];
    }
}
