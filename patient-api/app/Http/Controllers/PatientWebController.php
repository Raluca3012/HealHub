<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PatientWebController extends Controller
{
    public function index()
    {
        $patients = DB::table('patients')
            ->leftJoin('doctors', 'patients.doctor_id', '=', 'doctors.id')
            ->select('patients.*', 'doctors.name as doctor_name')
            ->get();

        return view('patients.index', compact('patients'));
    }

    public function create()
    {
        $doctors = DB::table('doctors')->select('id', 'name')->get();
        return view('patients.create', compact('doctors'));
    }

    public function edit($id)
    {
        $patient = DB::table('patients')->where('id', $id)->first();
        $doctors = DB::table('doctors')->select('id', 'name')->get();

        return view('patients.edit', compact('patient', 'doctors'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'email' => 'nullable|email',
            'mobile' => 'nullable|string',
            'address' => 'nullable|string',
            'room' => 'nullable|string',
            'status' => 'nullable|string',
            'doctor_id' => 'nullable|integer',
            'problem' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only([
            'name', 'gender', 'email', 'mobile',
            'address', 'room', 'status', 'doctor_id', 'problem'
        ]);

        // Setează automat checkin-ul cu data curentă
        $data['checkin'] = Carbon::now()->toDateString();

        // Poza pacient
        if ($request->hasFile('photo')) {
            $filename = 'patient_' . time() . '.' . $request->photo->getClientOriginalExtension();
            $path = $request->file('photo')->storeAs('uploads/patients', $filename, 'public');
            $data['image'] = $path;
        }

        DB::table('patients')->insert($data);

        return redirect()->route('patients.index')->with('success', 'Patient created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'email' => 'nullable|email',
            'mobile' => 'nullable|string',
            'address' => 'nullable|string',
            'room' => 'nullable|string',
            'status' => 'nullable|string',
            'doctor_id' => 'nullable|integer',
            'problem' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only([
            'name', 'gender', 'email', 'mobile',
            'address', 'room', 'status', 'doctor_id', 'problem'
        ]);

        $patient = DB::table('patients')->where('id', $id)->first();

        // Schimbare imagine doar dacă e nouă
        if ($request->hasFile('photo')) {
            // Ștergem vechea imagine dacă există
            if ($patient && $patient->image) {
                Storage::disk('public')->delete($patient->image);
            }

            $filename = 'patient_' . time() . '.' . $request->photo->getClientOriginalExtension();
            $path = $request->file('photo')->storeAs('uploads/patients', $filename, 'public');
            $data['image'] = $path;
        }

        // Nu actualizăm checkin-ul, îl păstrăm pe cel vechi
        DB::table('patients')->where('id', $id)->update($data);

        return redirect()->route('patients.index')->with('success', 'Patient updated successfully.');
    }
}
