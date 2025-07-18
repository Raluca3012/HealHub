<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['patient_id', 'content', 'author', 'created_at'];
    public $timestamps = true; // sau false, dacă nu folosești created_at/updated_at

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
