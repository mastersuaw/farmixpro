<?php

namespace App\Http\Requests;

use App\Support\CurrentCompany;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

abstract class CompanyFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function currentCompanyId(): int
    {
        return app(CurrentCompany::class)->requireId($this);
    }

    protected function existsInCompany(string $table, string $column = 'id'): Exists
    {
        return Rule::exists($table, $column)->where('companies_id', $this->currentCompanyId());
    }
}
