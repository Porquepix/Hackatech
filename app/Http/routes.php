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
Route::get('/user/{user}', 'UserController@show');
Route::put('/user/{user}', 'UserController@update');

/*
 * Login / Register / Password reset routes
 */
Route::post('register', 'AuthenticateController@register');
Route::post('authenticate', 'AuthenticateController@authenticate');
Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
Route::post('password/email', 'AuthenticateController@sendReset');
Route::put('password/reset', 'AuthenticateController@reset');

