<?php

namespace Tests\Feature;

use App\Models\Companies;
use App\Models\Products;
use App\Models\User;
use App\Models\UsersCompanies;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_list_companies(): void
    {
        $user = User::factory()->create();

        $create = $this->actingAs($user, 'sanctum')->postJson('/api/companies', [
            'name' => 'Agrocomercial El Paraíso',
            'address' => 'Manizales, Caldas',
        ]);

        $create->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Agrocomercial El Paraíso');

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/companies')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.name', 'Agrocomercial El Paraíso');

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/companies/current')
            ->assertOk()
            ->assertJsonPath('data.name', 'Agrocomercial El Paraíso');
    }

    public function test_user_can_attach_another_user_and_switch_company(): void
    {
        [$owner, $company] = $this->actingAsCompanyUser();
        $other = User::factory()->create();
        $second = Companies::factory()->create();

        UsersCompanies::query()->create([
            'users_id' => $owner->id,
            'companies_id' => $second->id,
        ]);

        $this->actingAs($owner, 'sanctum')
            ->postJson('/api/companies/'.$company->id.'/users', [
                'email' => $other->email,
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('users_companies', [
            'users_id' => $other->id,
            'companies_id' => $company->id,
        ]);

        $this->actingAs($owner, 'sanctum')
            ->postJson('/api/companies/'.$second->id.'/switch')
            ->assertOk()
            ->assertJsonPath('data.id', $second->id);

        $this->actingAs($owner, 'sanctum')
            ->getJson('/api/companies/current')
            ->assertJsonPath('data.id', $second->id);
    }

    public function test_company_resources_are_scoped_to_current_company(): void
    {
        [$userA, $companyA] = $this->actingAsCompanyUser();
        [$userB, $companyB] = $this->actingAsCompanyUser();

        $productA = Products::factory()->create([
            'companies_id' => $companyA->id,
            'nombre' => 'Café A',
        ]);

        Products::factory()->create([
            'companies_id' => $companyB->id,
            'nombre' => 'Café B',
        ]);

        $this->actingAs($userA, 'sanctum')
            ->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.nombre', 'Café A');

        $this->actingAs($userB, 'sanctum')
            ->getJson('/api/products/'.$productA->id)
            ->assertForbidden();

        $this->actingAs($userB, 'sanctum')
            ->withHeader('X-Company-Id', (string) $companyA->id)
            ->getJson('/api/products')
            ->assertForbidden();
    }

    public function test_guest_cannot_list_companies(): void
    {
        $this->getJson('/api/companies')->assertUnauthorized();
    }
}
