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

}

