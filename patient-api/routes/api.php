<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\StatsController;
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



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
