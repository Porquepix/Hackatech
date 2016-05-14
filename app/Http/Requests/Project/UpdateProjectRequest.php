<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Project;

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
        $project = Project::where('hackathon_id', $this->route('hackathons'))->findOrFail($this->route('projects'));
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
            'twitter' => 'max:255'
        ];
    }
}
