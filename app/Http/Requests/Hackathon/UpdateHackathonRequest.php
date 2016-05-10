<?php

namespace App\Http\Requests\Hackathon;

use App\Http\Requests\Request;
use JWTAuth;
use App\Hackathon;

class UpdateHackathonRequest extends Request
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
        return $hackathon->isAdmin($user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'max:255|min:2',
            'abstract' => 'max:150',
            'max_participant' => 'integer',
            'max_participant_per_team' => 'integer',
            'beginning' => 'date_format:"Y-m-d H:i"',
            'ending' => 'date_format:"Y-m-d H:i"',
            'facebook' => 'max:255',
            'twitter' => 'max:255',
            'github' => 'max:255',
        ];
    }
}
