<?php

namespace App\Models;

use Database\Factories\CompaniesFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'address'])]
class Companies extends Model
{
    /** @use HasFactory<CompaniesFactory> */
    use HasFactory;

    protected $table = 'companies';

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_companies', 'companies_id', 'users_id')
            ->withTimestamps();
    }

    public function usersCompanies(): HasMany
    {
        return $this->hasMany(UsersCompanies::class, 'companies_id');
    }

    public function taxes(): HasMany
    {
        return $this->hasMany(Taxes::class, 'companies_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Products::class, 'companies_id');
    }

    public function variantsProducts(): HasMany
    {
        return $this->hasMany(VariantsProducts::class, 'companies_id');
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channels::class, 'companies_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoices::class, 'companies_id');
    }

    public function methodsPayments(): HasMany
    {
        return $this->hasMany(MethodsPayments::class, 'companies_id');
    }
}
