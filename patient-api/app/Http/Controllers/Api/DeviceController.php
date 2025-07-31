<?php
namespace App\Http\Controllers\Api;

use App\Models\Device;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index()
    {
        return Device::with('model')->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $device = Device::findOrFail($id);
        $device->status = $request->status;
        $device->save();

        return response()->json(['message' => 'Status updated']);
    }

    public function update(Request $request, $id)
{
    $device = Device::findOrFail($id);
    $device->device_id = $request->device_id;
    $device->mac_id = $request->mac_id;
    $device->patient_id = $request->patient_id;
    $device->save();

    return response()->json(['message' => 'Device updated']);
}

}
?>