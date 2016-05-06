<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Request;
use JWTAuth;

class UpdateUserRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return JWTAuth::parseToken()->authenticate()->id == $this->route('id');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'email|unique:users',
            'facebook' => 'max:255',
            'twitter' => 'max:255',
            'github' => 'max:255'
        ];
    }
}
