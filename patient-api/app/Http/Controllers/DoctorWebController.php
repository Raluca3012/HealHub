<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DoctorWebController extends Controller
{
    public function index()
    {
        $doctors = DB::table('doctors')->orderBy('id')->get();
        return view('doctors.index', compact('doctors'));
    }

    public function create()
    {
        return view('doctors.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'specialty' => 'nullable|string',
            'address' => 'nullable|string',
            'working_at' => 'nullable|string',
            'experience_years' => 'nullable|integer',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $path = null;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = 'doctor_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('uploads/doctors', $filename, 'public');
        }

        DB::table('doctors')->insert([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'specialty' => $request->specialty,
            'address' => $request->address,
            'working_at' => $request->working_at,
            'experience_years' => $request->experience_years,
            'image' => $path,
            'joining_date' => now(),
            'created_at' => now(),
        ]);

        return redirect()->route('doctors.index')->with('success', 'Doctor added');
    }

    public function edit($id)
    {
        $doctor = DB::table('doctors')->where('id', $id)->first();
        return view('doctors.edit', compact('doctor'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'specialty' => 'nullable|string',
            'address' => 'nullable|string',
            'working_at' => 'nullable|string',
            'experience_years' => 'nullable|integer',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $doctor = DB::table('doctors')->where('id', $id)->first();
        $path = $doctor->image;

        if ($request->hasFile('photo')) {
            if ($doctor->image) {
                Storage::disk('public')->delete($doctor->image);
            }
            $file = $request->file('photo');
            $filename = 'doctor_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('uploads/doctors', $filename, 'public');
        }

        DB::table('doctors')->where('id', $id)->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'specialty' => $request->specialty,
            'address' => $request->address,
            'working_at' => $request->working_at,
            'experience_years' => $request->experience_years,
            'image' => $path,
        ]);

        return redirect()->route('doctors.index')->with('success', 'Doctor updated');
    }
}
