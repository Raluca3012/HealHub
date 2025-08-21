<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_date', 
        'appointment_time', 
        'specialty',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
