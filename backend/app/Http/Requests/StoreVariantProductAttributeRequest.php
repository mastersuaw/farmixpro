<?php

namespace App\Http\Requests;

class StoreVariantProductAttributeRequest extends CompanyFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'variants_products_id' => [$required, 'integer', $this->existsInCompany('variants_products')],
            'name' => [$required, 'string'],
            'value' => [$required, 'string'],
        ];
    }
}
