<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeviceModel extends Model
{
    protected $table = 'models';

    protected $fillable = [
        'name', 'description', 'status'
    ];

    public function devices()
    {
        return $this->hasMany(Device::class, 'model_id');
    }
}
?>