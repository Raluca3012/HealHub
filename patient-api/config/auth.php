<?php

return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        // Folosim token-ul salvat în coloana `api_token` din tabela users
        'api' => [
            'driver'   => 'token',
            'provider' => 'users',
            'hash'     => false, // token în clar (compatibil cu ce setezi în LoginController)
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => App\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => 'password_resets',
            'expire'   => 60,
        ],
    ],

];
