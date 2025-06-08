<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register a new cashier
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:6|max:255'
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'cashier', // only cashier registration via API
        ]);

        if($user){
            $token = $user->createToken($user->name . 'auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Cashier registered successfully',
                'user'    => $user,
                'token'   => $token,
            ], 201);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong during registration'
            ]);
        }

    }

    // Admin Login
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->where('role', 'admin')
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Admin login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // Cashier Login
    public function cashierLogin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->where('role', 'cashier')
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('cashier_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Cashier login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }


   // Logout the authenticated user
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }



}
