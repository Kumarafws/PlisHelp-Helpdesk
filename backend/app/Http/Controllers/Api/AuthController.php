<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request) { $data = $request->validate(['email'=>'required|email','password'=>'required|string']); $user = User::where('email',$data['email'])->first(); abort_unless($user && Hash::check($data['password'], $user->password), 422, 'Invalid credentials'); return ['user'=>$user, 'token'=>$user->createToken('plishelp')->plainTextToken]; }
    public function me(Request $request) { return $request->user(); }
    public function logout(Request $request) { $request->user()->currentAccessToken()?->delete(); return response()->noContent(); }
}
