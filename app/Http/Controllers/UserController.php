<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\ShowProfileRequest;
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

    public function update()
    {

    }

}
