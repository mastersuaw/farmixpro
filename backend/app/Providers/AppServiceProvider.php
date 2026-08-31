<?php

namespace App\Providers;

use App\Models\User;
use Dedoc\Scramble\Scramble;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Scramble::routes(function (Route $route): bool {
            return Str::startsWith($route->uri, 'api/');
        });

        Gate::define('viewApiDocs', function (?User $user): bool {
            if (app()->environment(['local', 'development', 'testing'])) {
                return true;
            }

            return $user !== null;
        });
    }
}
