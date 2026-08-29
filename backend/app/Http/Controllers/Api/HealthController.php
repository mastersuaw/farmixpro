<?php

namespace App\Http\Controllers\Api;

use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class HealthController
{
    public function __invoke(): JsonResponse
    {
        return ApiResponse::success([
            'service' => 'FarmixPro API',
            'status' => 'ok',
        ], 'API operativa.');
    }
}
