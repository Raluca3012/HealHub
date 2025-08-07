<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';

    public function doctor()
{
    return $this->belongsTo(Doctor::class);
}

protected $fillable = [
    'patient_id',
    'doctor_id',
    'appointment_date',
    'appointment_time',
    'specialty',
];

}

