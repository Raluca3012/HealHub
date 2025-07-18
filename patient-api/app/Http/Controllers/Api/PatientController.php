<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function show($id)
    {
        $patient = DB::table('patients')->where('id', $id)->first();

        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        // Preia programările
        $appointments = DB::table('appointments')
            ->where('patient_id', $id)
            ->orderBy('appointment_date', 'asc')
            ->get();

        $doctorId = optional($appointments->first())->doctor_id;
        $doctor = $doctorId
            ? DB::table('doctors')->where('id', $doctorId)->first()
            : null;

        // Notes
        $notes = DB::table('notes')
            ->where('patient_id', $id)
            ->orderBy('note_date', 'desc')
            ->get();

        // Reports
        $reports = DB::table('reports')
            ->where('patient_id', $id)
            ->get();

        return response()->json([
            'patient' => $patient,
            'appointments' => $appointments,
            'doctor' => $doctor,
            'notes' => $notes,
            'reports' => $reports,
        ]);
    }
public function index()
{
    $patients = DB::table('patients')
        ->leftJoin('doctors', 'patients.doctor_id', '=', 'doctors.id')
        ->select(
            'patients.*',
            'doctors.name as doctor_name',
            'doctors.email as doctor_email',
            'doctors.phone as doctor_phone',
            'doctors.specialty as doctor_specialty',
            'doctors.image as doctor_image'
        )
        ->get();

    return response()->json($patients);
}


    public function getDetails($id)
    {

        $patient = DB::table('patients')->where('id', $id)->first();

        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

       $appointments = DB::table('appointments')
    ->where('patient_id', $id)
    ->orderBy('appointment_date')
    ->orderBy('appointment_time')
    ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
    ->select(
        'appointments.*',
        'doctors.name as doctor_name',
        'doctors.email as doctor_email',
        'doctors.phone as doctor_phone',
        'doctors.specialty as doctor_specialty',
        'doctors.image as doctor_image'
    )
    ->get();


        $doctor = null;
        if (count($appointments) && $appointments[0]->doctor_id) {
            $doctor = DB::table('doctors')->where('id', $appointments[0]->doctor_id)->first();

            $rating = 0;
            $ratingCount = 0;

            if ($doctor && isset($doctor->id)) {
                $rating = DB::table('reviews')->where('doctor_id', $doctor->id)->avg('rating');
                $ratingCount = DB::table('reviews')->where('doctor_id', $doctor->id)->count();
            }
        }

        $doctor = $doctor ?: (object)[
            'name' => 'Dr. Unavailable',
            'email' => 'N/A',
            'phone' => 'N/A',
            'specialty' => 'N/A',
            'experience_years' => 'N/A',
            'image' => null
        ];


        $notes = DB::table('notes')
            ->where('patient_id', $id)
            ->orderBy('note_date', 'desc')
            ->get();

        $reports = DB::table('reports')
            ->where('patient_id', $id)
            ->get();

        return response()->json([
            'patient' => $patient,
            'appointments' => $appointments,
            'notes' => $notes,
            'reports' => $reports,
            'doctor' => $doctor,
            'rating' => round($rating, 1),
            'rating_count' => $ratingCount,
        ]);
    }
}
