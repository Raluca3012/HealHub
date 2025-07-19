<?php

namespace App\Http\Controllers\Api;

use App\Appointment;
use App\Http\Controllers\Controller;
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

}
