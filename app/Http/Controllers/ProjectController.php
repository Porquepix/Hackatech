<?php

namespace App\Http\Controllers;

use App\Project;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Project\ShowProjectRequest;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;

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
        return Project::where('hackathon_id', $hackathon_id)->get();
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
        return Project::where('hackathon_id', $hackathon_id)->findOrFail($project_id);
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
    public function destroy(UpdateProjectRequest $request, $hackathon_id, $project_id)
    {
        Project::destroy($project_id);
        return response()->json(['message' => 'The project has been successfully deleted !']);
    }
}
