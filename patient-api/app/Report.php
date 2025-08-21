<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';

    protected $fillable = [
        'patient_id',
        'report_type', // EEG / FNIRS
        'report_date',
        'label',        // GAMMA, BETA, etc
        'frequency',
        'unit',
    ];

    protected $appends = ['test_type', 'type', 'value'];

    public function getTestTypeAttribute()
    {
        return $this->report_type;
    }

    public function getTypeAttribute()
    {
        return $this->label;
    }

    public function getValueAttribute()
    {
        return $this->frequency;
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
