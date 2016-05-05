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

    public function show(ShowProfileRequest $request, User $user)
    {
        return $user;
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->fill($request->except(['id', 'name']));

        if ($request->has('password')) {
            $user->password = bcrypt($request->input('password'));
        }

        $user->save();
        return response()->json(['message' => 'Your profile has been successfully updated !']);
    }

}
