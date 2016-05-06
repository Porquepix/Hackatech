<?php

namespace App\Http\Requests\Organization;

use App\Http\Requests\Request;
use JWTAuth;

class ShowOrganizationRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        $adminCount = $user->organizationAdmin()->where('id', $this->route('organizations'))->count();
        $memberCount = $user->organizationMember()->where('id', $this->route('organizations'))->count();

        return ($adminCount + $memberCount) > 0;
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
