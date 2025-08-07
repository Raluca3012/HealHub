<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\User;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\ModelController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::get('/patients/{id}/notes', [PatientController::class, 'getNotesByPatientId']);
Route::get('/patients/{id}/reports/{type?}', [PatientController::class, 'getReports']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors-with-stats', [DoctorController::class, 'withStats']);
Route::get('/doctor/{id}/patients', [DoctorController::class, 'getPatients']);
Route::get('/patient/{id}/details', [PatientController::class, 'getDetails']);

Route::get('/doctor/{id}/details', [DoctorController::class, 'getDoctorDetails']);

Route::get('/doctors/top-rated', [DoctorController::class, 'topRated']);

Route::get('/stats', [StatsController::class, 'index']);
Route::get('/patient-overview/{mode}', [StatsController::class, 'patientOverview']);
Route::get('/patient-overview/{mode}', [PatientController::class, 'patientOverview']);
Route::get('/gender-distribution', [PatientController::class, 'genderDistribution']);
Route::get('/appointments/by-date/{date}', [AppointmentController::class, 'getByDate']);


Route::post('/login', [LoginController::class, 'apiLogin']);
Route::middleware('auth:api')->post('/logout', function (\Illuminate\Http\Request $request) {
    $user = $request->user();

    $user->api_token = null;
    $user->save();

    return response()->json(['message' => 'Logged out successfully']);
});

Route::post('/register', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name'     => 'required|string|max:255',
        'surname'  => 'required|string|max:255',
        'email'    => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => $validator->errors()->first()], 422);
    }

    $user = User::create([
        'name'      => $request->name . ' ' . $request->surname,
        'email'     => $request->email,
        'password'  => Hash::make($request->password),
        'role'      => 'receptionist',
        'api_token' => bin2hex(random_bytes(32)),
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'token' => $user->api_token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]
    ]);
});


Route::get('/devices', [DeviceController::class, 'index']);
Route::patch('/devices/{id}/status', [DeviceController::class, 'updateStatus']);

Route::get('/models', [ModelController::class, 'index']);
Route::patch('/models/{id}/status', [ModelController::class, 'updateStatus']);

Route::put('/models/{id}', [ModelController::class, 'update']);
Route::put('/devices/{id}', [DeviceController::class, 'update']);



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/patients/{id}/upload-photo', [PatientController::class, 'updatePhoto']);

Route::get('/notifications/today', 'NotificationController@today');

Route::get('/notifications/week', [NotificationController::class, 'thisWeek']);
use App\Http\Controllers\Api\UserProfileController;

Route::middleware('auth:api')->group(function () {
    Route::get('/user-profile', [UserProfileController::class, 'getProfile']);
    Route::post('/user-profile', [UserProfileController::class, 'updateProfile']);
});

Route::get('/appointments/times/{doctor_id}/{date}', [AppointmentController::class, 'takenTimes']);

Route::post('/appointments', [\App\Http\Controllers\Api\AppointmentController::class, 'store']);




Route::options('{any}', function (Request $request) {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
})->where('any', '.*');

