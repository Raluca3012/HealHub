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

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        return str_starts_with($this->image, 'http')
            ? $this->image
            : asset('storage/' . $this->image);
    }

      public function index()
    {
        return Patient::select('id', 'name', 'email', 'medical_id', 'address', 'mobile_number', 'problem', 'about')->get();
    }
}
