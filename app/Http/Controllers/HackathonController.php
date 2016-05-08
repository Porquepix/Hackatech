<?php

namespace App\Http\Controllers;

use App\Hackathon;
use App\Organization;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Hackathon\CreateHackathonRequest;
use App\Http\Requests\Hackathon\UpdateHackathonRequest;
use JWTAuth;

class HackathonController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['index', 'show']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Hackathon::orderBy('beginning', 'desc')->paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateHackathonRequest $request)
    {
        $hackathon = new Hackathon();
        $hackathon->fill($request->all());
        $hackathon->organization_id = $request->input('organization_id');
        $hackathon->save();
        return response()->json(['message' => 'The hackathon has been successfully created !']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Hackathon::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateHackathonRequest $request, $id)
    {
        $hackathon = Hackathon::findOrFail($id);
        $hackathon->fill($request->all());
        $hackathon->save();
        return response()->json(['message' => 'The hackathon has been successfully updated !']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(UpdateHackathonRequest $request, $id)
    {
        Hackathon::destroy($id);
        return response()->json(['message' => 'The hackathon has been successfully deleted !']);
    }
}
