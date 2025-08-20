@extends('layout')

@section('content')
<h2>Add Patient</h2>
<form method="POST" action="{{ route('patients.store') }}" enctype="multipart/form-data">
    @csrf

    <label>Name: <input type="text" name="name" required></label><br>

    <label>Gender:
        <select name="gender" required>
            <option>Male</option>
            <option>Female</option>
        </select>
    </label><br>

    <label>Email: <input type="email" name="email"></label><br>
    <label>Mobile: <input type="text" name="mobile"></label><br>
    <label>Address: <input type="text" name="address"></label><br>
    <label>Room: <input type="text" name="room"></label><br>

    <label>Status:
        <select name="status">
            <option>Recovered</option>
            <option>On recovery</option>
            <option>Pending</option>
            <option>Rejected</option>
        </select>
    </label><br>

    <label>Doctor:
        <select name="doctor_id">
            @foreach($doctors as $doctor)
                <option value="{{ $doctor->id }}">{{ $doctor->name }}</option>
            @endforeach
        </select>
    </label><br>

    <label>Problem: <input type="text" name="problem"></label><br>

    <label>Photo: <input type="file" name="photo"></label><br>

    <button type="submit">Save</button>
</form>
@endsection
