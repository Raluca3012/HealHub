<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PatientController extends Controller
{
    public function show($id)
    {
        $patient = DB::table('patients')->where('id', $id)->first();

        if (!$patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        $appointments = DB::table('appointments')
            ->where('patient_id', $id)
            ->orderBy('appointment_date', 'asc')
            ->get();

        $doctorId = optional($appointments->first())->doctor_id;
        $doctor = $doctorId
            ? DB::table('doctors')->where('id', $doctorId)->first()
            : null;

        $notes = DB::table('notes')->where('patient_id', $id)->orderBy('note_date', 'desc')->get();
        $reports = DB::table('reports')->where('patient_id', $id)->get();

        $patient->photo_url = $this->resolveImageUrl($patient->image);

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

        foreach ($patients as $patient) {
            $patient->photo_url = $this->resolveImageUrl($patient->image);
        }

        return response()->json($patients);
    }

    public function getDetails($id)
    {
        $patient = DB::table('patients')->where('id', $id)->first();
        if (!$patient) return response()->json(['error' => 'Patient not found'], 404);

        $patient->photo_url = $this->resolveImageUrl($patient->image);

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
        $rating = 0;
        $ratingCount = 0;

        if (count($appointments) && $appointments[0]->doctor_id) {
            $doctor = DB::table('doctors')->where('id', $appointments[0]->doctor_id)->first();
            $rating = DB::table('reviews')->where('doctor_id', $doctor->id)->avg('rating');
            $ratingCount = DB::table('reviews')->where('doctor_id', $doctor->id)->count();
        }

        $doctor = $doctor ?: (object)[
            'name' => 'Dr. Unavailable',
            'email' => 'N/A',
            'phone' => 'N/A',
            'specialty' => 'N/A',
            'experience_years' => 'N/A',
            'image' => null
        ];

        $notes = DB::table('notes')->where('patient_id', $id)->orderBy('note_date', 'desc')->get();
        $reports = DB::table('reports')->where('patient_id', $id)->get();

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

    public function updatePhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $patient = DB::table('patients')->where('id', $id)->first();
        if (!$patient) return response()->json(['error' => 'Patient not found'], 404);

        if ($patient->image && str_starts_with($patient->image, 'uploads/patients/')) {
            Storage::disk('public')->delete($patient->image);
        }

        $file = $request->file('photo');
        $filename = 'patient_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads/patients', $filename, 'public');

        DB::table('patients')->where('id', $id)->update(['image' => $path]);

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo_url' => asset('storage/' . $path),
            'image_path' => $path
        ]);
    }

    private function resolveImageUrl($image)
    {
        if (!$image) return null;
        if (str_starts_with($image, 'http')) return $image;
        return asset('storage/' . $image);
    }

    public function genderDistribution()
    {
        $male = DB::table('patients')->where('gender', 'Male')->count();
        $female = DB::table('patients')->where('gender', 'Female')->count();

        return response()->json([
            'male' => $male,
            'female' => $female,
        ]);
    }

    public function patientOverview($mode)
    {
        $baseQuery = DB::table('appointments')->join('patients', 'appointments.patient_id', '=', 'patients.id');

        switch ($mode) {
            case 'weekly':
                $data = $baseQuery->selectRaw("DAYNAME(appointments.appointment_date) AS period,
                    SUM(CASE WHEN patients.status = 'Recovered' THEN 1 ELSE 0 END) AS recovered,
                    SUM(CASE WHEN patients.status != 'Recovered' THEN 1 ELSE 0 END) AS hospitalized")
                    ->groupBy('period')
                    ->orderByRaw("FIELD(period, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')")
                    ->get();
                break;

            case 'monthly':
                $data = $baseQuery->selectRaw("DATE_FORMAT(appointments.appointment_date, '%b') AS period,
                    SUM(CASE WHEN patients.status = 'Recovered' THEN 1 ELSE 0 END) AS recovered,
                    SUM(CASE WHEN patients.status != 'Recovered' THEN 1 ELSE 0 END) AS hospitalized")
                    ->groupBy('period')
                    ->orderByRaw("FIELD(period, 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')")
                    ->get();
                break;

            default:
                $data = $baseQuery->selectRaw("YEAR(appointments.appointment_date) AS period,
                    SUM(CASE WHEN patients.status = 'Recovered' THEN 1 ELSE 0 END) AS recovered,
                    SUM(CASE WHEN patients.status != 'Recovered' THEN 1 ELSE 0 END) AS hospitalized")
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get();
                break;
        }

        return response()->json($data);
    }
}
