<?php

namespace App\Http\Requests\Organization;

use App\Http\Requests\Request;
use App\Organization;
use JWTAuth;

class RemoveMemberRequest extends Request
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

        $isOrganizationAdmin = $organisation->admin_id == $user->id;
        $isMember = $user->id == $this->route('members');

        return $isOrganizationAdmin || $isMember;
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
