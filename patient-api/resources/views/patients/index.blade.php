@extends('layout')

@section('content')
<h2>All Patients</h2>
<a href="{{ route('patients.create') }}">Add New Patient</a>
<table border="1" cellpadding="10">
    <tr>
        <th>ID</th>
        <th>Photo</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Status</th>
        <th>Address</th>
        <th>Room</th>
        <th>Doctor</th>
        <th>Actions</th>
    </tr>
    @foreach($patients as $patient)
        <tr>
            <td>{{ $patient->id }}</td>
            <td>
                @if($patient->image)
                    <img src="{{ asset('storage/' . $patient->image) }}" width="80">
                @else
                    No Image
                @endif
            </td>
            <td>{{ $patient->name }}</td>
            <td>{{ $patient->gender }}</td>
            <td>{{ $patient->email }}</td>
            <td>{{ $patient->mobile }}</td>
            <td>{{ $patient->status }}</td>
            <td>{{ $patient->address }}</td>
            <td>{{ $patient->room }}</td>
            <td>{{ $patient->doctor_name }}</td>
            <td><a href="{{ route('patients.edit', $patient->id) }}">Edit</a></td>
        </tr>
    @endforeach
</table>
@endsection
