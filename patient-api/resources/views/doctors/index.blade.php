@extends('layout_doc')

@section('content')
<h2>All Doctors</h2>
<a href="{{ route('doctors.create') }}">Add New Doctor</a>
<table border="1" cellpadding="10">
    <thead>
        <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialty</th>
            <th>Address</th>
            <th>Working at</th>
            <th>Experience</th>
            <th>Joining Date</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($doctors as $doctor)
            <tr>
                <td>{{ $doctor->id }}</td>
                <td>
                    @if($doctor->image)
                        <img src="{{ asset('storage/' . $doctor->image) }}" width="80">
                    @else
                        No Image
                    @endif
                </td>
                <td>Dr. {{ $doctor->name }}</td>
                <td>{{ $doctor->email }}</td>
                <td>{{ $doctor->phone }}</td>
                <td>{{ $doctor->specialty }}</td>
                <td>{{ $doctor->address }}</td>
                <td>{{ $doctor->working_at }}</td>
                <td>{{ $doctor->experience_years }}</td>
                <td>{{ \Carbon\Carbon::parse($doctor->joining_date)->format('Y-m-d') }}</td>
                <td><a href="{{ route('doctors.edit', $doctor->id) }}">Edit</a></td>
            </tr>
        @endforeach
    </tbody>
</table>
@endsection
