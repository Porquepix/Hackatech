<?php

namespace App\Http\Requests\Hackathon;

use App\Http\Requests\Request;
use JWTAuth;
use App\Organization;

class CreateHackathonRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $organization = Organization::findOrFail($this->input('organization_id'));
        return $organization->isAdmin($user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:255|min:2',
            'abstract' => 'required|max:150',
            'description' => 'required',
            'max_participant' => 'required|integer',
            'max_participant_per_team' => 'required|integer',
            'place_adr' => 'required',
            'beginning' => 'required|date_format:"Y-m-d H:i"',
            'ending' => 'required|date_format:"Y-m-d H:i"',
            'facebook' => 'max:255',
            'twitter' => 'max:255',
            'github' => 'max:255',
            'organization_id' => 'required|exists:organizations,id'
        ];
    }
}
