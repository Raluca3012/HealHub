@extends('layout_doc')

@section('content')
<h2>Edit Doctor</h2>
<form method="POST" action="{{ route('doctors.update', $doctor->id) }}" enctype="multipart/form-data">
    @csrf
    <label>Name: <input type="text" name="name" value="{{ $doctor->name }}" required></label><br>
    <label>Email: <input type="email" name="email" value="{{ $doctor->email }}"></label><br>
    <label>Phone: <input type="text" name="phone" value="{{ $doctor->phone }}"></label><br>
    <label>Specialty: <input type="text" name="specialty" value="{{ $doctor->specialty }}"></label><br>
    <label>Address: <input type="text" name="address" value="{{ $doctor->address }}"></label><br>
    <label>Working at: <input type="text" name="working_at" value="{{ $doctor->working_at }}"></label><br>
    <label>Experience Years: <input type="number" name="experience_years" value="{{ $doctor->experience_years }}"></label><br>
    <label>Change Photo: <input type="file" name="photo"></label><br>
    @if($doctor->image)
        <img src="{{ asset('storage/' . $doctor->image) }}" width="80"><br>
    @endif
    <button type="submit">Update</button>
</form>
@endsection
