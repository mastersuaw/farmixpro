<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Companies::class, 'users_companies', 'users_id', 'companies_id')
            ->withTimestamps();
    }

    public function usersCompanies(): HasMany
    {
        return $this->hasMany(UsersCompanies::class, 'users_id');
    }

    public function invoicesOpened(): HasMany
    {
        return $this->hasMany(Invoices::class, 'who_open');
    }

    public function invoicesClosed(): HasMany
    {
        return $this->hasMany(Invoices::class, 'who_close');
    }

    public function invocesProducts(): HasMany
    {
        return $this->hasMany(InvocesProducts::class, 'users_id');
    }
}
