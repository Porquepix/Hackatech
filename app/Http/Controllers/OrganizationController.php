<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Organization\ShowOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Http\Requests\Organization\CreateOrganizationRequest;
use App\Http\Requests\Organization\DeleteOrganizationRequest;
use App\Http\Requests\Organization\AddMemberRequest;
use App\Http\Requests\Organization\RemoveMemberRequest;
use App\Http\Requests\User\ShowProfileRequest;
use App\Organization;
use App\User;
use JWTAuth;

class OrganizationController extends Controller
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
    public function index()
    {
        return Organization::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateOrganizationRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateOrganizationRequest $request)
    {
        $organization = new Organization();
        $organization->fill($request->all());
        $organization->admin_id = JWTAuth::parseToken()->authenticate()->id;
        $organization->save();
        return response()->json(['message' => 'The organization has been successfully created !']);
    }

    /**
     * Display the specified resource.
     *
     * @param ShowOrganizationRequest $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShowOrganizationRequest $request, $id)
    {
        return Organization::with('admin', 'members')->findOrFail($id);
    }

    /**
     * Display the specified resource for one user.
     *
     * @param ShowProfileRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showForUser(ShowProfileRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $admin = $user->organizationAdmin()->get();
        $member = $user->organizationMember()->get();
        return response()->json(compact('admin', 'member'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateOrganizationRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrganizationRequest $request, $id)
    {
        $organization = Organization::findOrFail($id);
        $organization->fill($request->all());
        $organization->save();
        return response()->json(['message' => 'The organization has been successfully updated !']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param DeleteOrganizationRequest $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteOrganizationRequest $request, $id)
    {
        Organization::destroy($id);
        return response()->json(['message' => 'The organization has been successfully deleted !']);
    }

    /**
     * Add a user in the organization.
     *
     * @param AddMemberRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addMember(AddMemberRequest $request, $id)
    {
        $organization = Organization::findOrFail($id);
        $user = User::where('name', $request->input('name'))->first();

        // Check if the user is the admin of the organization
        if ($organization->admin_id != $user->id)
        {
            $alreadyMember = $organization->members()->where('user_id', $user->id)->first();
            // Check if the user is already a member of the organization
            if (!$alreadyMember)
            {
                $organization->members()->attach($user->id);
                return response()->json(['message' => 'The user has been successfully added !']);
            }
            else
            {
                return response()->json(['error' => 'Can\'t add this user: he is already a member of this organization.'], 400);
            }
        }
        else
        {
            return response()->json(['error' => 'Can\'t add this user: he is already the administrator of this organization.'], 400);
        }
    }

    /**
     * Remove a user from the organization.
     *
     * @param RemoveMemberRequest $request
     * @param int $id
     * @param int $user_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeMember(RemoveMemberRequest $request, $id, $user_id) {
        $organization = Organization::findOrFail($id);
        $organization->members()->detach($user_id);
        return response()->json(['message' => 'The user has been successfully removed !']);
    }

}
