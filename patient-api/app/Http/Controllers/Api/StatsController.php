<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        $doctorCount = DB::table('doctors')->count();
        $patientCount = DB::table('patients')->count();
        $appointmentCount = DB::table('appointments')->count();

        return response()->json([
            'doctors' => $doctorCount,
            'patients' => $patientCount,
            'appointments' => $appointmentCount,
        ]);
    }

    public function patientOverview($mode)
{
    switch ($mode) {
        case 'weekly':
            $groupFormat = '%Y-%u'; // ISO week
            break;
        case 'monthly':
            $groupFormat = '%Y-%m';
            break;
        case 'yearly':
        default:
            $groupFormat = '%Y';
            break;
    }

    $results = DB::table('patients')
        ->selectRaw("DATE_FORMAT(created_at, '{$groupFormat}') as period")
        ->selectRaw("SUM(CASE WHEN status = 'Recovered' THEN 1 ELSE 0 END) as recovered")
        ->selectRaw("SUM(CASE WHEN status IN ('On recovery', 'Pending') THEN 1 ELSE 0 END) as hospitalized")
        ->groupBy('period')
        ->orderBy('period')
        ->selectRaw("DATE_FORMAT(COALESCE(created_at, NOW()), '{$groupFormat}') as period")
        ->selectRaw("CAST(SUM(CASE WHEN status = 'Recovered' THEN 1 ELSE 0 END) AS UNSIGNED) as recovered")
->selectRaw("CAST(SUM(CASE WHEN status IN ('On recovery', 'Pending') THEN 1 ELSE 0 END) AS UNSIGNED) as hospitalized")

        ->get();

    return response()->json($results);
}

}
