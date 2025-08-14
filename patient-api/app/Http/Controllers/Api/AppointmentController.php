<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Appointment;
use App\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class AppointmentController extends Controller
{
    public function getByDate($date)
    {
        $appointments = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->whereDate('appointments.appointment_date', $date)
            ->orderBy('appointments.appointment_time', 'asc')
            ->select(
                'patients.name as patient_name',
                'patients.problem as patient_problem',
                'doctors.name as doctor_name',
                'doctors.image as doctor_image',
                'appointments.appointment_date',
                'appointments.appointment_time',
                'appointments.id'
            )
            ->get();

        return response()->json($appointments);
    }

    public function takenTimes($doctor_id, $date)
    {
        $takenTimes = Appointment::where('doctor_id', $doctor_id)
            ->whereDate('appointment_date', $date)
            ->pluck('appointment_time')
            ->toArray();

        return response()->json($takenTimes);
    }


    public function store(Request $request)
{
    $validated = $request->validate([
        'patient_id' => 'required|exists:patients,id',
        'doctor_id' => 'required|exists:doctors,id',
        'appointment_date' => 'required|date',
        'appointment_time' => 'required|date_format:H:i:s',
        'specialty' => 'nullable|string|max:255',
    ]);

    dd($validated); 
}

}
