<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttachCompanyUserRequest;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\UserResource;
use App\Models\Companies;
use App\Models\User;
use App\Models\UsersCompanies;
use App\Support\ApiResponse;
use App\Support\CurrentCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $companies = $request->user()
            ->companies()
            ->latest('companies.id')
            ->paginate((int) $request->integer('per_page', 15));

        return ApiResponse::paginated($companies, CompanyResource::class, 'Empresas obtenidas correctamente.');
    }

    public function store(StoreCompanyRequest $request, CurrentCompany $currentCompany): JsonResponse
    {
        $company = Companies::query()->create($request->validated());

        UsersCompanies::query()->create([
            'users_id' => $request->user()->id,
            'companies_id' => $company->id,
        ]);

        $currentCompany->switchTo($request->user(), (int) $company->id);

        return ApiResponse::created(
            new CompanyResource($company),
            'Empresa creada correctamente.',
        );
    }

    public function show(Request $request, Companies $company): JsonResponse
    {
        $this->assertCompanyMember($request, (int) $company->id);

        return ApiResponse::success(new CompanyResource($company), 'Empresa obtenida correctamente.');
    }

    public function update(StoreCompanyRequest $request, Companies $company): JsonResponse
    {
        $this->assertCompanyMember($request, (int) $company->id);
        $company->update($request->validated());

        return ApiResponse::success(
            new CompanyResource($company->fresh()),
            'Empresa actualizada correctamente.',
        );
    }

    public function destroy(Request $request, Companies $company): JsonResponse
    {
        $this->assertCompanyMember($request, (int) $company->id);
        $company->delete();

        return ApiResponse::success(null, 'Empresa eliminada correctamente.');
    }

    public function current(Request $request, CurrentCompany $currentCompany): JsonResponse
    {
        $id = $currentCompany->id($request);

        if ($id === null) {
            return ApiResponse::success(null, 'No hay empresa seleccionada.');
        }

        $company = $request->user()->companies()->where('companies.id', $id)->firstOrFail();

        return ApiResponse::success(new CompanyResource($company), 'Empresa actual obtenida correctamente.');
    }

    public function switch(Request $request, Companies $company, CurrentCompany $currentCompany): JsonResponse
    {
        $currentCompany->switchTo($request->user(), (int) $company->id);

        return ApiResponse::success(
            new CompanyResource($company),
            'Empresa seleccionada correctamente.',
        );
    }

    public function attachUser(AttachCompanyUserRequest $request, Companies $company): JsonResponse
    {
        $this->assertCompanyMember($request, (int) $company->id);

        $user = $request->filled('users_id')
            ? User::query()->findOrFail($request->integer('users_id'))
            : User::query()->where('email', $request->validated('email'))->firstOrFail();

        UsersCompanies::query()->firstOrCreate([
            'users_id' => $user->id,
            'companies_id' => $company->id,
        ]);

        return ApiResponse::success(
            new UserResource($user->load('companies')),
            'Usuario vinculado a la empresa.',
        );
    }

    public function detachUser(Request $request, Companies $company, User $user): JsonResponse
    {
        $this->assertCompanyMember($request, (int) $company->id);

        UsersCompanies::query()
            ->where('companies_id', $company->id)
            ->where('users_id', $user->id)
            ->delete();

        return ApiResponse::success(null, 'Usuario desvinculado de la empresa.');
    }
}
