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
use App\Http\Controllers\PatientWebController;
use App\Http\Controllers\DoctorWebController;

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


Route::get('/patients', [PatientWebController::class, 'index'])->name('patients.index');
Route::get('/patients/create', [PatientWebController::class, 'create'])->name('patients.create');
Route::post('/patients/store', [PatientWebController::class, 'store'])->name('patients.store');
Route::get('/patients/{id}/edit', [PatientWebController::class, 'edit'])->name('patients.edit');
Route::post('/patients/{id}/update', [PatientWebController::class, 'update'])->name('patients.update');


Route::get('/doctors', [DoctorWebController::class, 'index'])->name('doctors.index');
Route::get('/doctors/create', [DoctorWebController::class, 'create'])->name('doctors.create');
Route::post('/doctors/store', [DoctorWebController::class, 'store'])->name('doctors.store');
Route::get('/doctors/{id}/edit', [DoctorWebController::class, 'edit'])->name('doctors.edit');
Route::post('/doctors/{id}/update', [DoctorWebController::class, 'update'])->name('doctors.update');