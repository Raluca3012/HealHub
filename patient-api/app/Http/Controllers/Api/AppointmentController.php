<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Appointment;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::orderBy('appointment_date')->orderBy('appointment_time')->get();
    }

    public function getByDate($date)
    {
        // $date trebuie sa fie Y-m-d
        $appointments = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->whereDate('appointments.appointment_date', $date)
            ->orderBy('appointments.appointment_time', 'asc')
            ->select(
                'patients.name as patient_name',
                'patients.problem as patient_problem',
                'patients.image as patient_image',
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
        // $date: Y-m-d
        $takenTimes = Appointment::where('doctor_id', $doctor_id)
            ->whereDate('appointment_date', $date)
            ->pluck('appointment_time')
            ->toArray();

        return response()->json($takenTimes);
    }

    public function store(Request $request)
    {
        // Validare strictă pe format (evităm 22-08-2025)
        $validated = $request->validate([
            'patient_id'       => 'required|exists:patients,id',
            'doctor_id'        => 'required|exists:doctors,id',
            'appointment_date' => 'required|date_format:Y-m-d',
            'appointment_time' => 'required|date_format:H:i:s',
            'specialty'        => 'nullable|string|max:255',
        ]);

        // Prevenim dublarea slotului (același doctor, aceeași zi & oră)
        $exists = Appointment::where('doctor_id', $validated['doctor_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Selected time is already taken for this doctor.',
            ], 422);
        }

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment created successfully',
            'data'    => $appointment,
        ], 201);
    }
}
