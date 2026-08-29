<?php

namespace App\Http\Controllers;

use App\Support\CurrentCompany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

abstract class Controller
{
    protected function currentCompanyId(Request $request): int
    {
        return app(CurrentCompany::class)->requireId($request);
    }

    /**
     * @param  class-string<Model>  $modelClass
     */
    protected function forCompany(Request $request, string $modelClass): Builder
    {
        return $modelClass::query()->where('companies_id', $this->currentCompanyId($request));
    }

    protected function assertCompanyResource(Request $request, Model $model): void
    {
        if ((int) $model->getAttribute('companies_id') !== $this->currentCompanyId($request)) {
            throw new AccessDeniedHttpException('No tienes acceso a este recurso.');
        }
    }

    protected function assertCompanyMember(Request $request, int $companyId): void
    {
        if (! app(CurrentCompany::class)->belongs($request->user(), $companyId)) {
            throw new AccessDeniedHttpException('No perteneces a esta empresa.');
        }
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function withCompany(Request $request, array $data): array
    {
        $data['companies_id'] = $this->currentCompanyId($request);

        return $data;
    }
}
