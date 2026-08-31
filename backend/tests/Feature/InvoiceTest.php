<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Models\MethodsPayments;
use App\Models\Products;
use App\Models\Taxes;
use App\Models\VariantsProducts;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_invoice_with_lines_taxes_and_payments(): void
    {
        [$user, $company] = $this->actingAsCompanyUser();

        $product = Products::factory()->create(['companies_id' => $company->id, 'precio' => 10000]);
        $variant = VariantsProducts::factory()->create([
            'companies_id' => $company->id,
            'products_id' => $product->id,
            'sku' => 'CAFE-INV-1',
        ]);
        $tax = Taxes::factory()->create([
            'companies_id' => $company->id,
            'nombre' => 'IVA 19%',
            'tasa' => 19,
        ]);
        $method = MethodsPayments::factory()->create([
            'companies_id' => $company->id,
            'nombre' => 'Efectivo',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/invoices', [
            'fecha' => now()->toDateString(),
            'status' => InvoiceStatus::Open->value,
            'products' => [
                [
                    'variants_id' => $variant->id,
                    'cantidad' => 2,
                    'precio' => 10000,
                    'descuento' => 0,
                ],
            ],
            'taxes' => [
                ['impuestos_id' => $tax->id],
            ],
            'payments' => [
                [
                    'metodos_pagos_id' => $method->id,
                    'amount' => 23800,
                    'discount' => 0,
                    'rate' => 1,
                ],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'open')
            ->assertJsonPath('data.subtotal', 20000)
            ->assertJsonPath('data.total', 23800)
            ->assertJsonPath('data.products.0.cantidad', 2)
            ->assertJsonPath('data.taxes.0.impuestos_id', $tax->id)
            ->assertJsonPath('data.payments.0.amount', 23800);

        $this->assertDatabaseHas('invoices', [
            'id' => $response->json('data.id'),
            'companies_id' => $company->id,
            'who_open' => $user->id,
        ]);
        $this->assertDatabaseCount('invoces_products', 1);
        $this->assertDatabaseCount('invoces_taxes', 1);
        $this->assertDatabaseCount('how_paid', 1);
    }
}
