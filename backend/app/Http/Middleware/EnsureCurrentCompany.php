<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use App\Support\CurrentCompany;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class EnsureCurrentCompany
{
    public function __construct(private readonly CurrentCompany $currentCompany) {}

    public function handle(Request $request, Closure $next): Response
    {
        try {
            $companyId = $this->currentCompany->requireId($request);
        } catch (Throwable $e) {
            $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 403;

            return ApiResponse::error($e->getMessage() !== '' ? $e->getMessage() : 'Selecciona o crea una empresa para continuar.', null, $status);
        }

        $request->attributes->set('companies_id', $companyId);

        return $next($request);
    }
}
