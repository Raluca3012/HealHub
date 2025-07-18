<?php


namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
  

use App\Doctor;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::with('reports')->get();
        return response()->json($doctors);
    }


public function show($id)
{
    $doctor = DB::table('doctors')->where('id', $id)->first();

    if (!$doctor) {
        return response()->json(['message' => 'Doctor not found'], 404);
    }

    $reports = DB::table('reports')->where('doctor_id', $id)->get();

    return response()->json([
        'doctor' => $doctor,
        'reports' => $reports
    ]);

}

}
