<?php


namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
  

use App\Patient;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::with('reports')->get();
        return response()->json($patients);
    }


public function show($id)
{
    $patient = DB::table('patients')->where('id', $id)->first();

    if (!$patient) {
        return response()->json(['message' => 'Patient not found'], 404);
    }

    $reports = DB::table('reports')->where('patient_id', $id)->get();

    return response()->json([
        'patient' => $patient,
        'reports' => $reports
    ]);

}

}
