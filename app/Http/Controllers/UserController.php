<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\User\ShowProfileRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\User;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    /**
     * Display data about the user.
     *
     * @param ShowProfileRequest $request
     * @param int $id
     * @return mixed
     */
    public function show(ShowProfileRequest $request, $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update a user profile.
     *
     * @param UpdateUserRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);

        $user->fill($request->except(['name']));
        if ($request->has('password'))
        {
            $user->password = bcrypt($request->input('password'));
        }
        $user->save();

        return response()->json(['message' => 'Your profile has been successfully updated !']);
    }

    /**
     * Autocomplete a username.
     *
     * @param $username
     * @return \Illuminate\Http\JsonResponse
     */
    public function autocomplete($username)
    {
        $results = User::select('name', 'email')->where('name', 'ILIKE', "%$username%")->get();
        return response()->json(compact('results'));
    }

    public function hackathonParticipation(ShowProfileRequest $request, $id)
    {
        return User::findOrFail($id)->hackathons()->orderBy('beginning', 'DESC')->get();
    }

    public function hackathonOrganization(ShowProfileRequest $request, $id)
    {
        return $user = User::with('organizationAdmin.hackathons', 'organizationMember.hackathons')->findOrFail($id);
    }

}
