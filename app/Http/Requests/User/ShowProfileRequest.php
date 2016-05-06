<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Request;
use JWTAuth;

class ShowProfileRequest extends Request
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
            //
        ];
    }
}
