<?php

namespace Tests;

use App\Models\Companies;
use App\Models\User;
use App\Models\UsersCompanies;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * @return array{0: User, 1: Companies}
     */
    protected function actingAsCompanyUser(?User $user = null, ?Companies $company = null): array
    {
        $user ??= User::factory()->create();
        $company ??= Companies::factory()->create();

        UsersCompanies::query()->firstOrCreate([
            'users_id' => $user->id,
            'companies_id' => $company->id,
        ]);

        $this->actingAs($user, 'sanctum');

        return [$user, $company];
    }
}
