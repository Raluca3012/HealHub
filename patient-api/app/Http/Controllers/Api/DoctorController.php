<?php

namespace App\Http\Controllers\Api;

use App\Doctor;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
{
    public function withStats()
    {
        $doctors = DB::table('doctors')
            ->leftJoin('appointments', 'doctors.id', '=', 'appointments.doctor_id')
            ->leftJoin('reviews', 'doctors.id', '=', 'reviews.doctor_id')
            ->select(
                'doctors.id',
                'doctors.name',
                'doctors.email',
                'doctors.phone',
                'doctors.specialty',
                'doctors.experience_years',
                'doctors.image',
                'doctors.address',
                'doctors.working_at',
                DB::raw('COUNT(DISTINCT appointments.id) as appointments_count'),
                DB::raw("IF(COUNT(DISTINCT appointments.id) > 0, 'Available', 'Unavailable') as status"),
                DB::raw('ROUND(AVG(reviews.rating), 1) as average_rating')
            )
            ->groupBy(
                'doctors.id',
                'doctors.name',
                'doctors.email',
                'doctors.phone',
                'doctors.specialty',
                'doctors.experience_years',
                'doctors.image',
                'doctors.address',
                'doctors.working_at'
            )
            ->orderByDesc('average_rating')
            ->get();

        return response()->json($doctors);
    }



    public function getPatientDetails($id)
    {
        $patient = DB::table('patients')->where('id', $id)->first();

        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        $doctor = DB::table('doctors')->where('name', $patient->doctor_name)->first();

        $appointments = DB::table('appointments')->where('patient_id', $id)->get();
        $notes = DB::table('notes')->where('patient_id', $id)->get();
        $reports = DB::table('reports')->where('patient_id', $id)->get();

        $reviews = DB::table('doctor_reviews')
            ->where('doctor_id', $doctor->id)
            ->pluck('rating');

        $averageRating = $reviews->count() > 0 ? round($reviews->avg(), 1) : null;
        $reviewCount = $reviews->count();

        return response()->json([
            'patient' => $patient,
            'doctor' => $doctor,
            'appointments' => $appointments,
            'notes' => $notes,
            'reports' => $reports,
            'rating' => $averageRating,
            'rating_count' => $reviewCount,
        ]);
    }

    public function getDoctorDetails($id)
{
    $doctor = DB::table('doctors')->where('id', $id)->first();

    if (!$doctor) {
        return response()->json(['error' => 'Doctor not found'], 404);
    }

    $appointments = DB::table('appointments')
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->where('appointments.doctor_id', $id)
        ->select(
            'appointments.id',
            'appointments.appointment_date',
            'appointments.appointment_time',
            'appointments.patient_id',
            'patients.name as patient_name',
            'patients.problem as patient_problem',
            'patients.image as patient_image'
        )
        ->orderBy('appointments.appointment_date')
        ->get();

    $patients = DB::table('patients')
        ->whereIn('id', $appointments->pluck('patient_id')->unique())
        ->get();


    $reviews = DB::table('reviews')
        ->where('doctor_id', $id)
        ->orderBy('created_at', 'desc')
        ->get();

    $averageRating = $reviews->avg('rating');
    $ratingCount = $reviews->count();

    return response()->json([
        'doctor' => $doctor,
        'appointments' => $appointments,
        'patients' => $patients,
        'reviews' => $reviews,
        'rating' => round($averageRating, 1),
        'rating_count' => $ratingCount,
    ]);
}

    public function index()
    {
        $doctors = Doctor::withCount('appointments')->get();

        return $doctors->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'email' => $doctor->email,
                'mobile' => $doctor->phone,
                'specialist' => $doctor->specialty,
                'experience' => $doctor->experience_years . ' Years',
                'joining' => $doctor->joining_date,
                'status' => $doctor->appointments_count > 0 ? 'Available' : 'Unavailable',
                'schedule' => $doctor->appointments_count > 0 ? $doctor->appointments_count . ' Appointments' : 'No Schedule',
                'image' => $doctor->image,

            ];
        });
    }

    public function topRated()
{
    $topDoctors = DB::table('doctors')
        ->leftJoin('appointments', 'doctors.id', '=', 'appointments.doctor_id')
        ->leftJoin('reviews', 'doctors.id', '=', 'reviews.doctor_id')
        ->select(
            'doctors.id',
            'doctors.name',
            'doctors.specialty',
            'doctors.image',
            DB::raw('ROUND(AVG(reviews.rating), 1) as average_rating')
        )
        ->groupBy(
            'doctors.id',
            'doctors.name',
            'doctors.specialty',
            'doctors.image'
        )
        ->orderByDesc('average_rating')
        ->limit(4)
        ->get();

    return response()->json($topDoctors);
}

}
