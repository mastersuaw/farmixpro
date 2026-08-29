<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CurrentCompany
{
    public const HEADER = 'X-Company-Id';

    public function id(Request $request): ?int
    {
        $user = $request->user();

        if ($user === null) {
            return null;
        }

        $header = $request->header(self::HEADER);

        if ($header !== null && $header !== '') {
            $id = (int) $header;

            if (! $this->belongs($user, $id)) {
                throw new AccessDeniedHttpException('No perteneces a esta empresa.');
            }

            return $id;
        }

        $cached = Cache::get($this->cacheKey($user));

        if ($cached !== null && $this->belongs($user, (int) $cached)) {
            return (int) $cached;
        }

        $first = $user->companies()->orderBy('users_companies.id')->value('companies.id');

        return $first !== null ? (int) $first : null;
    }

    public function requireId(Request $request): int
    {
        $id = $this->id($request);

        if ($id === null) {
            throw new HttpException(422, 'Selecciona o crea una empresa para continuar.');
        }

        return $id;
    }

    public function switchTo(User $user, int $companyId): void
    {
        if (! $this->belongs($user, $companyId)) {
            throw new AccessDeniedHttpException('No perteneces a esta empresa.');
        }

        Cache::forever($this->cacheKey($user), $companyId);
    }

    public function belongs(User $user, int $companyId): bool
    {
        return $user->companies()->where('companies.id', $companyId)->exists();
    }

    private function cacheKey(User $user): string
    {
        return "user:{$user->id}:current_company_id";
    }
}
