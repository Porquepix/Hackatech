<?php

namespace App\Http\Requests\Organization;

use App\Http\Requests\Request;
use App\Organization;
use JWTAuth;

class AddMemberRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $organisation = Organization::findOrFail($this->route('organizations'));
        return $organisation->admin_id == $user->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|exists:users,name'
        ];
    }
}
