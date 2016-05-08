<?php

namespace App\Http\Controllers;

use App\Hackathon;
use App\Organization;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Hackathon\CreateHackathonRequest;
use App\Http\Requests\Hackathon\UpdateHackathonRequest;
use App\Http\Requests\Hackathon\ParticipantHackathonRequest;
use App\Http\Requests\Hackathon\UpdateParticipantHackathonRequest;
use App\Http\Requests\Hackathon\DeleteParticipantHackathonRequest;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

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
        $hackathon = Hackathon::findOrFail($id);
        $data = $hackathon->toArray();
        try
        {
            $user = JWTAuth::parseToken()->toUser();
        }
        catch (JWTException $e)
        {
            $user = null;
        }

        // Get more data about the hackathon
        $organization = $hackathon->organization->name;
        $nbParticipants = $hackathon->participants()->count();
        $isRegistered = $user != null && $hackathon->isRegistered($user);
        $isAttending = $isRegistered && $hackathon->isAttending();
        $isOrganizator = $user != null && $hackathon->isOrganizator($user);
        $isAdmin = $user != null && $hackathon->isAdmin($user);
        $isOver = $hackathon->isOver();
        $isStarted = $hackathon->isStarted();

        return response()->json(compact('data', 'organization', 'nbParticipants', 'isRegistered', 'isAttending', 'isOrganizator', 'isAdmin', 'isOver', 'isStarted'));
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

    /**
     * Get all participants of an hackathon.
     *
     * @param ParticipantHackathonRequest $request
     * @param int $id
     * @return mixed
     */
    public function getParticipant(ParticipantHackathonRequest $request, $id)
    {
        return Hackathon::findOrFail($id)->participants;
    }

    /**
     * Register a user to an hackathon.
     *
     * @param UpdateParticipantHackathonRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addParticipant(UpdateParticipantHackathonRequest $request, $id)
    {
        $hackathon = Hackathon::findOrFail($id);

        // If the hackathon is started, disable user registration.
        $connected_user = JWTAuth::parseToken()->authenticate();
        if ((!$hackathon->isAdmin($connected_user) || !$hackathon->isOrganizator($connected_user)) && $hackathon->isStarted())
        {
            return response()->json(['error' => 'Can\'t add this user: hackathon is already started.'], 400);
        }

        $user = User::findOrFail($request->input('user_id'));

        // Check if the user is a staff memebr
        if (!$hackathon->isAdmin($user) && !$hackathon->isOrganizator($user)) {
            $alreadyRegisterer = $hackathon->participants()->where('user_id', $user->id)->first();

            // Check if the user is already registered in the hackathon
            if (!$alreadyRegisterer)
            {
                $hackathon->participants()->attach($request->input('user_id'));
                return response()->json(['message' => 'The user has been successfully added to the list of participants !']);
            }
            else
            {
                return response()->json(['error' => 'Can\'t add this user: he is already participating to this hackathon.'], 400);
            }
        }
        else
        {
            return response()->json(['error' => 'Can\'t add this user: he is a staff member for this hackathon.'], 400);
        }
    }

    /**
     * Update the participation of a user.
     *
     * @param ParticipantHackathonRequest $request
     * @param int $id
     * @param int $participant_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateParticipant(ParticipantHackathonRequest $request, $id, $participant_id)
    {
        $hackathon = Hackathon::findOrFail($id);

        if ($request->has('attending'))
        {
            $hackathon->participants()->updateExistingPivot($participant_id, ['attending' => (bool) $request->input('attending')]);
        }

        return response()->json(['message' => 'The user has been successfully updated !']);
    }

    /**
     * Remove a user participation.
     *
     * @param DeleteParticipantHackathonRequest $request
     * @param int $id
     * @param int $participant_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeParticipant(DeleteParticipantHackathonRequest $request, $id, $participant_id)
    {
        $hackathon = Hackathon::findOrFail($id);

        // If the hackathon is started, disable user cancelation.
        $connected_user = JWTAuth::parseToken()->authenticate();
        if ((!$hackathon->isAdmin($connected_user) || !$hackathon->isOrganizator($connected_user)) && $hackathon->isStarted())
        {
            return response()->json(['error' => 'Can\'t remove this user: hackathon is already started.'], 400);
        }

        $hackathon->participants()->detach($participant_id);
        return response()->json(['message' => 'The user has been successfully removed from the list of participants !']);
    }

}
