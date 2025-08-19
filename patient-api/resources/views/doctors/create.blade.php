@extends('layout_doc')

@section('content')
<h2>Add Doctor</h2>
<form method="POST" action="{{ route('doctors.store') }}" enctype="multipart/form-data">
    @csrf
    <label>Name: <input type="text" name="name" required></label><br>
    <label>Email: <input type="email" name="email"></label><br>
    <label>Phone: <input type="text" name="phone"></label><br>
    <label>Specialty: <input type="text" name="specialty"></label><br>
    <label>Address: <input type="text" name="address"></label><br>
    <label>Working at: <input type="text" name="working_at"></label><br>
    <label>Experience Years: <input type="number" name="experience_years"></label><br>
    <label>Photo: <input type="file" name="photo"></label><br>
    <button type="submit">Save</button>
</form>
@endsection
