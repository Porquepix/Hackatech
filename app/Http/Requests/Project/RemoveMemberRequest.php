<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Project;
use App\Hackathon;

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

        $hackathon = Hackathon::findOrFail($this->route('hackathons'));
        if ($hackathon->isOver())
        {
            return false;
        }

        $project = Project::where('hackathon_id', $hackathon->id)->findOrFail($this->route('projects'));
        return $project->isAdmin($user) || $user->id == $this->route('members_id');
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
