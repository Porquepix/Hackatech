<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\Organization\ShowOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Http\Requests\Organization\CreateOrganizationRequest;
use App\Http\Requests\User\ShowProfileRequest;
use App\Organization;
use App\User;

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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param UpdateOrganizationRequest $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(UpdateOrganizationRequest $request, $id)
    {
        //
    }
}
