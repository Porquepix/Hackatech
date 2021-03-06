<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Project;
use App\Hackathon;

class UpdateProjectRequest extends Request
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
        return $project->isAdmin($user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'max:255',
            'github' => 'mex:255',
            'facebook' => 'max:255',
            'twitter' => 'max:255',
            'validate' => 'boolean'
        ];
    }
}
