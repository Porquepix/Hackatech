<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Http\Requests;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\PasswdSendResetRequest;
use App\Http\Requests\PasswdResetRequest;
use JWTAuth;
use DB;
use Mail;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class AuthenticateController extends Controller
{

    /**
     * Authenticates a user based on his email and his password.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(AuthRequest $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            $token = JWTAuth::attempt($credentials);
            if ($token) {
                return response()->json(compact('token'));
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'Could not create token.'], 500);
        }

        return response()->json(['error' => 'Invalid credentials !'], 401);
    }

    /**
     * Retrieves a user thanks to his token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthenticatedUser()
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();
            if ($user) {
                 // the token is valid and we have found the user via the sub claim
                return response()->json(compact('user'));
            }

        } catch (TokenExpiredException $e) {

            return response()->json(['error' => 'Token expired !'], $e->getStatusCode());

        } catch (TokenInvalidException $e) {

            return response()->json(['error' => 'Token invalid !'], $e->getStatusCode());

        } catch (JWTException $e) {

            return response()->json(['error' => 'Token absent !'], $e->getStatusCode());

        }

        return response()->json(['error' => 'User not found !'], 404);
    }

    /**
     * Register a new user.
     *
     * @param Requests\RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password'))
        ]);
        $message = 'You have successfully registered !';
        return response()->json(compact('user', 'message'), 201);
    }

    /**
     * Send a reset password email.
     *
     * @param PasswdSendResetRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendReset(PasswdSendResetRequest $request)
    {
        $email = $request->get('email');
        $token = sha1($email . uniqid());

        DB::table('password_resets')->where('email', $email)->delete();
        DB::table('password_resets')->insert(['email' => $email, 'token' => $token, 'created_at' => date("Y-m-d H:i:s")]);

        $body = '<a href="' . $request->input('link') . '?token=' . $token . '&email=' . $email . '">' .
                $request->input('title', 'Reset my password') .
            '</a>';
        Mail::raw($body, function($message) use ($email) {
            $message->from('noreply.hackatech@alexis-andrieu.fr', 'Hackatech');

            $message->to($email)->subject('[Hackatech] Password reset !');
        });

        return response()->json(['message' => 'We will send you an email with a link to reset your password.'], 200);
    }

    /**
     * Reset password for a user.
     *
     * @param PasswdResetRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset(PasswdResetRequest $request)
    {
        $email = $request->get('email');
        $token = $request->get('token');
        $passwd = $request->get('password');

        $query = DB::table('password_resets')->where('email', $email)->where('token', $token);
        if ($query->count() == 1)  {
            $query->delete();
            User::where('email', $email)->update(['password' => bcrypt($passwd)]);
            return response()->json(['message' => 'Password reset.'], 200);
        } else {
            return response()->json(['error' => 'Token invalid !'], 400);
        }
    }


}
