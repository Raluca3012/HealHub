@extends('layout')

@section('content')
<h2>Edit Patient</h2>
<form method="POST" action="{{ route('patients.update', $patient->id) }}" enctype="multipart/form-data">
    @csrf

    <label>Name: <input type="text" name="name" value="{{ $patient->name }}" required></label><br>

    <label>Gender:
        <select name="gender">
            <option {{ $patient->gender === 'Male' ? 'selected' : '' }}>Male</option>
            <option {{ $patient->gender === 'Female' ? 'selected' : '' }}>Female</option>
        </select>
    </label><br>

    <label>Email: <input type="email" name="email" value="{{ $patient->email }}"></label><br>
    <label>Mobile: <input type="text" name="mobile" value="{{ $patient->mobile }}"></label><br>
    <label>Address: <input type="text" name="address" value="{{ $patient->address }}"></label><br>
    <label>Room: <input type="text" name="room" value="{{ $patient->room }}"></label><br>

    <label>Status:
        <select name="status">
            @foreach(['Recovered', 'On recovery', 'Pending', 'Rejected'] as $status)
                <option value="{{ $status }}" {{ $patient->status === $status ? 'selected' : '' }}>{{ $status }}</option>
            @endforeach
        </select>
    </label><br>

    <label>Doctor:
        <select name="doctor_id">
            @foreach($doctors as $doctor)
                <option value="{{ $doctor->id }}" {{ $patient->doctor_id == $doctor->id ? 'selected' : '' }}>
                    {{ $doctor->name }}
                </option>
            @endforeach
        </select>
    </label><br>

    <label>Change Photo: <input type="file" name="photo"></label><br>
    @if($patient->image)
        <img src="{{ asset('storage/' . $patient->image) }}" width="80"><br>
    @endif

    <button type="submit">Update</button>
</form>
@endsection
