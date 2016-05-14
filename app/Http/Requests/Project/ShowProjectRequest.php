<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Hackathon;

class ShowProjectRequest extends Request
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

        $isRegistered = $hackathon->isRegistered($user);
        $isAttending = $isRegistered && $hackathon->isAttending();
        $isOrganizator = $hackathon->isOrganizator($user);
        $isAdmin = $hackathon->isAdmin($user);

        return $isAttending || $isOrganizator || $isAdmin;
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
