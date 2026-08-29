<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Companies;
use App\Models\Customers;
use App\Models\Invoices;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoices>
 */
class InvoicesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'companies_id' => Companies::factory(),
            'who_open' => User::factory(),
            'who_close' => null,
            'clientes_id' => Customers::factory(),
            'fecha' => fake()->date(),
            'subtotal' => 0,
            'total' => 0,
            'status' => InvoiceStatus::Open,
        ];
    }
}
