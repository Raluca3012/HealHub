<?php 
namespace App\Http\Controllers\Api;

use App\Models\DeviceModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ModelController extends Controller
{
    public function index()
    {
        return DeviceModel::all();
    }

    public function updateStatus(Request $request, $id)
    {
        $model = DeviceModel::findOrFail($id);
        $model->status = $request->status;
        $model->save();

        return response()->json(['message' => 'Model status updated']);
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
    ]);

    $model = DeviceModel::findOrFail($id);
    $model->name = $request->name;
    $model->description = $request->description;
    $model->save();

    return response()->json(['message' => 'Model updated']);
}

}
?>