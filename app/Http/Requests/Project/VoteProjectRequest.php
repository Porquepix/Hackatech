<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Hackathon;

class VoteProjectRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $hackathon = Hackathon::findOrFail($this->route('hackathons'));
        if ($hackathon->isOver())
        {
            return false;
        }

        $isOrganizator = $hackathon->isOrganizator($user);
        $isAdmin = $hackathon->isAdmin($user);

        return $isOrganizator || $isAdmin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'mark' => 'required|integer|between:0,20'
        ];
    }
}
