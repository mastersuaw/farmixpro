<?php

namespace Tests\Feature;

use App\Models\Products;
use App\Models\VariantsProducts;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductVariantTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_product_and_variant_with_attributes(): void
    {
        [$user] = $this->actingAsCompanyUser();

        $product = $this->actingAs($user, 'sanctum')->postJson('/api/products', [
            'nombre' => 'Café pergamino',
            'descripcion' => 'Café seco',
            'precio' => 18500,
        ]);

        $product->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nombre', 'Café pergamino');

        $variant = $this->actingAs($user, 'sanctum')->postJson('/api/variants-products', [
            'products_id' => $product->json('data.id'),
            'sku' => 'CAFE-001-PREM',
            'name' => 'Premium',
            'description' => 'Grano seleccionado',
            'stock' => 40.5,
            'attributes' => [
                ['name' => 'origen', 'value' => 'Caldas'],
                ['name' => 'malla', 'value' => '15'],
            ],
        ]);

        $variant->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Premium')
            ->assertJsonPath('data.sku', 'CAFE-001-PREM')
            ->assertJsonPath('data.attributes.0.name', 'origen')
            ->assertJsonPath('data.attributes.1.value', '15');

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/variants-products/'.$variant->json('data.id'))
            ->assertOk()
            ->assertJsonPath('data.product.nombre', 'Café pergamino');
    }

    public function test_user_can_update_variant_and_replace_attributes(): void
    {
        [$user, $company] = $this->actingAsCompanyUser();
        $product = Products::factory()->create(['companies_id' => $company->id]);
        $variant = VariantsProducts::factory()->create([
            'companies_id' => $company->id,
            'products_id' => $product->id,
            'sku' => 'TOM-001',
            'name' => 'Primera',
        ]);

        $this->actingAs($user, 'sanctum')
            ->putJson('/api/variants-products/'.$variant->id, [
                'name' => 'Extra',
                'sku' => 'TOM-001-X',
                'attributes' => [
                    ['name' => 'calibre', 'value' => 'grande'],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Extra')
            ->assertJsonPath('data.sku', 'TOM-001-X')
            ->assertJsonPath('data.attributes.0.value', 'grande');

        $this->assertDatabaseCount('variants_products_attributes', 1);
    }

    public function test_variant_cannot_use_product_from_another_company(): void
    {
        [$user] = $this->actingAsCompanyUser();
        $foreign = Products::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/variants-products', [
                'products_id' => $foreign->id,
                'sku' => 'X-001',
                'name' => 'Ajeno',
            ])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }
}
