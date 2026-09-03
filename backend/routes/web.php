<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\AccountController;

Route::get('/', function () {
    return view('farmixpro');
});

Route::resource('clientes', ClienteController::class);

Route::resource('accounts', AccountController::class);