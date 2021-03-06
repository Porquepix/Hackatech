<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
 * Base route
 */
Route::get('/', 'IndexController@index');

/*
 * User routes
 */
Route::get('users/autocomplete/{username}', 'UserController@autocomplete');
Route::get('users/{id}/hackathons/participate', 'UserController@hackathonParticipation');
Route::get('users/{id}/hackathons/organize', 'UserController@hackathonOrganization');
Route::get('users/{id}/organizations', 'OrganizationController@showForUser');
Route::get('users/{id}', 'UserController@show');
Route::put('users/{id}', 'UserController@update');

/*
 * Login / Register / Password reset routes
 */
Route::post('register', 'AuthenticateController@register');
Route::post('authenticate', 'AuthenticateController@authenticate');
Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
Route::post('password/email', 'AuthenticateController@sendReset');
Route::put('password/reset', 'AuthenticateController@reset');

/*
 * Organization routes
 */
Route::get('organizations/{organizations}/hackathons', 'OrganizationController@showHackathons');
Route::delete('organizations/{organizations}/members/{members}', 'OrganizationController@removeMember');
Route::post('organizations/{organizations}/members', 'OrganizationController@addMember');
Route::resource('organizations', 'OrganizationController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);

/*
 * Vote routes
 */
Route::put('hackathons/{hackathons}/projects/{projects}/votes', 'ProjectController@updateVote');
Route::post('hackathons/{hackathons}/projects/{projects}/votes', 'ProjectController@addVote');

/*
 * Projects routes
 */
Route::delete('hackathons/{hackathons}/projects/{projects}/members/{members_id}', 'ProjectController@removeMember');
Route::put('hackathons/{hackathons}/projects/{projects}/members/{members_id}', 'ProjectController@updateMember');
Route::get('hackathons/{hackathons}/projects/{projects}/members', 'ProjectController@getMembers');
Route::post('hackathons/{hackathons}/projects/{projects}/members', 'ProjectController@addMember');
Route::resource('hackathons/{hackathons}/projects', 'ProjectController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);

/*
 * News routes
 */
Route::get('hackathons/{hackathons}/news/latest', 'NewsController@latest');
Route::resource('hackathons/{hackathons}/news', 'NewsController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);

/*
 * Hackathons routes
 */
Route::get('hackathons/{hackathons}/ranking', 'HackathonController@ranking');
Route::delete('hackathons/{hackathons}/participants/{participant_id}', 'HackathonController@removeParticipant');
Route::put('hackathons/{hackathons}/participants/{participant_id}', 'HackathonController@updateParticipant');
Route::get('hackathons/{hackathons}/participants', 'HackathonController@getParticipants');
Route::post('hackathons/{hackathons}/participants', 'HackathonController@addParticipant');
Route::resource('hackathons', 'HackathonController', ['only' => ['index', 'store', 'show', 'update', 'destroy']]);
