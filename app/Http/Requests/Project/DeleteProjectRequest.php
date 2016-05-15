<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\Request;
use JWTAuth;
use App\Project;
use App\Hackathon;

class DeleteProjectRequest extends Request
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

        $project = Project::where('hackathon_id', $this->route('hackathons'))->findOrFail($this->route('projects'));

        $isOrganizator = $hackathon->isOrganizator($user);
        $isAdmin = $hackathon->isAdmin($user);

        return $project->isAdmin($user) || $isOrganizator || $isAdmin;
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
