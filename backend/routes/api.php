<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\HowPaidController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\InvoiceProductController;
use App\Http\Controllers\Api\InvoiceTaxController;
use App\Http\Controllers\Api\MethodPaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TaxController;
use App\Http\Controllers\Api\VariantProductAttributeController;
use App\Http\Controllers\Api\VariantProductChannelController;
use App\Http\Controllers\Api\VariantProductController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('companies/current', [CompanyController::class, 'current']);
    Route::post('companies/{company}/switch', [CompanyController::class, 'switch']);
    Route::post('companies/{company}/users', [CompanyController::class, 'attachUser']);
    Route::delete('companies/{company}/users/{user}', [CompanyController::class, 'detachUser']);
    Route::apiResource('companies', CompanyController::class);

    Route::middleware('company')->group(function (): void {
        Route::apiResource('taxes', TaxController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('variants-products', VariantProductController::class)
            ->parameters(['variants-products' => 'variant']);
        Route::apiResource('variant-attributes', VariantProductAttributeController::class)
            ->parameters(['variant-attributes' => 'attribute']);
        Route::apiResource('channels', ChannelController::class);
        Route::apiResource('variant-channels', VariantProductChannelController::class)
            ->parameters(['variant-channels' => 'variantChannel']);
        Route::apiResource('invoices', InvoiceController::class);
        Route::apiResource('invoice-products', InvoiceProductController::class)
            ->parameters(['invoice-products' => 'invoiceProduct']);
        Route::apiResource('invoice-taxes', InvoiceTaxController::class)
            ->parameters(['invoice-taxes' => 'invoiceTax']);
        Route::apiResource('methods-payments', MethodPaymentController::class)
            ->parameters(['methods-payments' => 'methodPayment']);
        Route::apiResource('how-paid', HowPaidController::class)
            ->parameters(['how-paid' => 'howPaid']);
    });
});
