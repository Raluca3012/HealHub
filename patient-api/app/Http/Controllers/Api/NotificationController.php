<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function today()
    {
        $today = Carbon::today()->toDateString();

        $appointments = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->whereDate('appointments.appointment_date', $today)
            ->select(
                'appointments.appointment_time',
                'appointments.specialty',
                'patients.name as patient_name',
                'doctors.name as doctor_name'
            )
            ->get();

        $notifications = $appointments->map(function ($appt) {
            return [
                'title' => 'Appointment Today',
                'message' => "Patient {$appt->patient_name} has an appointment with Dr. {$appt->doctor_name} ({$appt->specialty}) at {$appt->appointment_time}.",
            ];
        });

        return response()->json($notifications);
    }


   public function thisWeek()
{
    try {
        $startOfWeek = Carbon::now()->startOfWeek()->toDateString();
        $endOfWeek = Carbon::now()->endOfWeek()->toDateString();

        $appointments = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->whereBetween('appointment_date', [$startOfWeek, $endOfWeek])
            ->orderBy('appointment_date')
            ->select([
                'appointments.appointment_date',
                'appointments.appointment_time',
                'appointments.specialty',
                'patients.name as patient_name',
                'doctors.name as doctor_name'
            ])
            ->get();

        $notifications = $appointments->map(function ($appt) {
            return [
                'title' => 'Upcoming Appointment',
                'message' => "On {$appt->appointment_date}, patient {$appt->patient_name} has an appointment with Dr. {$appt->doctor_name} ({$appt->specialty}) at {$appt->appointment_time}."
            ];
        });

        return response()->json($notifications);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
    }
}

}
