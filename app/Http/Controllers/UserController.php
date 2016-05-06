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

    public function show(ShowProfileRequest $request, $id)
    {
        return User::findOrFail($id);
    }

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

}
