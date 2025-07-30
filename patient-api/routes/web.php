<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Patient;
use Illuminate\Support\Facades\Route;

use App\User;
use Illuminate\Support\Facades\Hash;

Route::get('/test', function () {
    try {
        $patient = Patient::with(['appointments', 'notes', 'reports'])->first();
        return response()->json($patient);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});



Route::get('/create-test-user', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    return response()->json(['message' => 'User created', 'user' => $user]);
});

Route::get('/', function () {
    return view('welcome');
});
