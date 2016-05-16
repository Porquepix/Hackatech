<?php

namespace App\Http\Controllers;

use App\Hackathon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;

class IndexController extends Controller
{

    /**
     * Get some stats about hackatech.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(['nbChallengers' => User::count(), 'nbHackathons' => Hackathon::count()]);
    }

}
