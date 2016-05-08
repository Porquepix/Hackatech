<?php

namespace App\Http\Requests\Hackathon;

use App\Http\Requests\Request;
use JWTAuth;
use App\Hackathon;

class UpdateParticipantHackathonRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($this->input('user_id') == $user->id)
        {
            return true;
        }

        $hackathon = Hackathon::findOrFail($this->route('hackathons'));
        return $hackathon->isAdmin($user) || $hackathon->isOrganizator($user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id'
        ];
    }
}
