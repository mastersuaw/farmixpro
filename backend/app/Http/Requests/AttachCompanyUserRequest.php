<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachCompanyUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'users_id' => ['required_without:email', 'nullable', 'integer', 'exists:users,id'],
            'email' => ['required_without:users_id', 'nullable', 'email', 'exists:users,email'],
        ];
    }
}
