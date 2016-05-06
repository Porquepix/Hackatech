<?php

namespace App\Http\Requests\Organization;

use App\Http\Requests\Request;

class CreateOrganizationRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:255|unique:organizations',
            'email' => 'required|email',
            'facebook' => 'max:255',
            'twitter' => 'max:255'
        ];
    }
}
