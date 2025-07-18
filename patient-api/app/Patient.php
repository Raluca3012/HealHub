<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'patient_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'patient_id');
    }
}
