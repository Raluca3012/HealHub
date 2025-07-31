<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'device_id', 'mac_id', 'patient_id', 'model_id', 'status'
    ];

    public function model()
    {
        return $this->belongsTo(DeviceModel::class, 'model_id');
    }
}
?>