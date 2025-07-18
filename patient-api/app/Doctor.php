<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctors';
    
public function appointments()
{
    return $this->hasMany(Appointment::class, 'doctor_id');
}


    public function notes()
    {
        return $this->hasMany(Note::class, '_id');
    }

public function reports()
{
    return $this->hasMany(Report::class, 'patient_id');
}


}

