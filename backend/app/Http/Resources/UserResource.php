<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Support\CurrentCompany;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'companies' => CompanyResource::collection($this->whenLoaded('companies')),
            'current_company_id' => $this->when(
                $request->user()?->id === $this->id,
                fn () => app(CurrentCompany::class)->id($request),
            ),
            'created_at' => $this->created_at,
        ];
    }
}
