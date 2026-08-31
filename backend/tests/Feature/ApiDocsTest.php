<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiDocsTest extends TestCase
{
    use RefreshDatabase;

    public function test_openapi_document_is_available(): void
    {
        $response = $this->get('/docs/api.json');

        $response->assertOk()
            ->assertJsonPath('openapi', '3.1.0')
            ->assertJsonPath('info.title', 'FarmixPro API');

        $paths = $response->json('paths');

        $this->assertIsArray($paths);
        $this->assertArrayHasKey('/health', $paths);
        $this->assertArrayHasKey('/auth/login', $paths);
        $this->assertArrayHasKey('components', $response->json());
    }

    public function test_docs_ui_is_available_without_auth_in_testing(): void
    {
        $this->get('/docs/api')->assertOk();
    }

    public function test_docs_require_authentication_in_production(): void
    {
        $this->app['env'] = 'production';

        $this->get('/docs/api.json')->assertForbidden();

        $this->actingAs(User::factory()->create())
            ->get('/docs/api.json')
            ->assertOk();
    }
}
