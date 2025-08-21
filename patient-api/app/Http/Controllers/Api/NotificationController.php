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
                'appointments.appointment_date',
                'appointments.appointment_time',
                'appointments.specialty',
                'patients.id as patient_id',
                'patients.name as patient_name',
                'patients.mobile as patient_phone', 
                'doctors.id as doctor_id',
                'doctors.name as doctor_name'
            )
            ->orderBy('appointments.appointment_time', 'asc')
            ->get();

        $notifications = $appointments->map(function ($appt) {
            $id = sha1($appt->appointment_date.'|'.$appt->appointment_time.'|'.$appt->patient_id.'|'.$appt->doctor_id); 
            return [
                'id'            => $id,
                'title'         => 'Appointment Today',
                'message'       => "Patient {$appt->patient_name} has an appointment with Dr. {$appt->doctor_name} ({$appt->specialty}) at {$appt->appointment_time}.",
                'patient_phone' => $appt->patient_phone,
            ];
        });

        return response()->json($notifications);
    }

    public function thisWeek()
    {
        try {
            $startOfWeek = Carbon::now()->startOfWeek()->toDateString();
            $endOfWeek   = Carbon::now()->endOfWeek()->toDateString();

            $appointments = DB::table('appointments')
                ->join('patients', 'appointments.patient_id', '=', 'patients.id')
                ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
                ->whereBetween('appointments.appointment_date', [$startOfWeek, $endOfWeek])
                ->orderBy('appointments.appointment_date')
                ->orderBy('appointments.appointment_time')
                ->select(
                    'appointments.appointment_date',
                    'appointments.appointment_time',
                    'appointments.specialty',
                    'patients.id as patient_id',
                    'patients.name as patient_name',
                    'patients.mobile as patient_phone', 
                    'doctors.id as doctor_id',
                    'doctors.name as doctor_name'
                )
                ->get();

            $notifications = $appointments->map(function ($appt) {
                $id = sha1($appt->appointment_date.'|'.$appt->appointment_time.'|'.$appt->patient_id.'|'.$appt->doctor_id); 
                return [
                    'id'            => $id,
                    'title'         => 'Upcoming Appointment',
                    'message'       => "On {$appt->appointment_date}, patient {$appt->patient_name} has an appointment with Dr. {$appt->doctor_name} ({$appt->specialty}) at {$appt->appointment_time}.",
                    'patient_phone' => $appt->patient_phone,
                ];
            });

            return response()->json($notifications);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        return response()->json(['message' => 'Dismissed'], 200);
    }
}
