<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());
        $token = $user->createToken('api')->plainTextToken;

        return ApiResponse::created([
            'user' => new UserResource($user->load('companies')),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Cuenta creada correctamente.');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            return ApiResponse::error('Credenciales inválidas.', [
                'email' => ['El correo o la contraseña no son correctos.'],
            ], 422);
        }

        $token = $user->createToken('api')->plainTextToken;

        return ApiResponse::success([
            'user' => new UserResource($user->load('companies')),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Sesión iniciada correctamente.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success(null, 'Sesión cerrada correctamente.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new UserResource($request->user()->load('companies')),
            'Perfil obtenido correctamente.',
        );
    }
}
