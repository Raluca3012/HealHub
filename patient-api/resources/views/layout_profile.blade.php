<!DOCTYPE html>
<html>
<head>
    <title>Profile Page</title>
</head>
<body>
    <nav>
        <a href="{{ route('profile.edit') }}">My Profile</a>

    </nav>

    <main>
        @yield('content')
    </main>
</body>
</html>
