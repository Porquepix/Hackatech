<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;

class IndexController extends Controller
{

    public function index()
    {
        return response()->json(['nbChallengers' => User::count()]);
    }

}
