<?php

namespace App\Http\Controllers;

use App\Project;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Project\ShowProjectRequest;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Requests\Project\DeleteProjectRequest;
use App\Http\Requests\Project\AddMemberRequest;
use App\Http\Requests\Project\RemoveMemberRequest;
use App\Http\Requests\Project\VoteProjectRequest;

use JWTAuth;

class ProjectController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(ShowProjectRequest $request, $hackathon_id)
    {
        // Get the project of the user
        $user = JWTAuth::parseToken()->authenticate();
        $user_project = $user->getProject($hackathon_id);

        $data = Project::where('hackathon_id', $hackathon_id)->with(['voting' => function($query) use ($user) {
            $query->where('user_id', $user->id);
        }])->get();

        return response()->json(compact('data', 'user_project'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProjectRequest $request, $hackathon_id)
    {
        $project = new Project();
        $project->fill($request->all());
        $project->hackathon_id = $hackathon_id;
        $project->admin_id = JWTAuth::parseToken()->authenticate()->id;
        $project->save();
        return response()->json(['message' => 'The project has been successfully created !'], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShowProjectRequest $request, $hackathon_id, $project_id)
    {
        $data = Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);

        // Get the project of the user
        $user = JWTAuth::parseToken()->authenticate();
        $user_project = $user->getProject($hackathon_id);

        $private_section = null;
        if ($user_project != null && $user_project->id == $data->id)
        {
            $private_section = $data->private_section;
        }

        return response()->json(compact('data', 'user_project', 'private_section'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProjectRequest $request, $hackathon_id, $project_id)
    {
        $project = Project::findOrFail($project_id);
        $project->fill($request->all());
        $project->save();
        return response()->json(['message' => 'The project has been successfully updated !']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteProjectRequest $request, $hackathon_id, $project_id)
    {
        Project::destroy($project_id);
        return response()->json(['message' => 'The project has been successfully deleted !']);
    }

    public function getMembers(ShowProjectRequest $request, $hackathon_id, $project_id)
    {
        $project = Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);
        return $project->members()->where('validate', true)->get();
    }

    /**
     * Add a user to a project.
     *
     * @param AddMemberRequest $request
     * @param int $hackathon_id
     * @param int $project_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addMember(AddMemberRequest $request, $hackathon_id, $project_id)
    {
        $project = Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);
        $project->members()->attach(JWTAuth::parseToken()->authenticate()->id);
        return response()->json(['message' => 'The user has been successfully added !']);
    }

    /**
     * Remove a user from a project.
     *
     * @param RemoveMemberRequest $request
     * @param $hackathon_id
     * @param $project_id
     * @param $user_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeMember(RemoveMemberRequest $request, $hackathon_id, $project_id, $user_id)
    {
        $project = Project::findOrFail($project_id);
        $project->members()->detach($user_id);
        return response()->json(['message' => 'The user has been successfully removed !']);
    }

    /**
     * Update a user of a project.
     *
     * @param UpdateProjectRequest $request
     * @param $hackathon_id
     * @param $project_id
     * @param $user_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateMember(UpdateProjectRequest $request, $hackathon_id, $project_id, $user_id)
    {
        $project = Project::findOrFail($project_id);
        $project->members()->updateExistingPivot($user_id, ['validate' => (bool) $request->input('validate')]);
        return response()->json(['message' => 'The user has been successfully updated !']);
    }

    /**
     * Add a mark on a project.
     *
     * @param VoteProjectRequest $request
     * @param int $hackathon_id
     * @param int $project_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addVote(VoteProjectRequest $request, $hackathon_id, $project_id)
    {
        $project = Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);
        $project->voting()->attach(JWTAuth::parseToken()->authenticate()->id, ['mark' => $request->input('mark')]);
        return response()->json(['message' => 'The mark has been successfully created !'], 201);
    }

    /**
     * Update a mark on a project.
     *
     * @param VoteProjectRequest $request
     * @param int $hackathon_id
     * @param int $project_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateVote(VoteProjectRequest $request, $hackathon_id, $project_id)
    {
        $project = Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);
        $project->voting()->updateExistingPivot(JWTAuth::parseToken()->authenticate()->id, ['mark' => $request->input('mark')]);
        return response()->json(['message' => 'The mark has been successfully updated !']);
    }

}
