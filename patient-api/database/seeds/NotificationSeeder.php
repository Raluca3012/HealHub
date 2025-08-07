<?php

use Illuminate\Database\Seeder;
use App\Notification;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        Notification::create([
            'user_id' => null,
            'title' => 'System Update',
            'body' => 'Dashboard system update scheduled for tonight.',
            'date' => now()->toDateString(),
        ]);

        Notification::create([
            'user_id' => 1,
            'title' => 'Appointment Reminder',
            'body' => 'You have an appointment with Dr. Smith at 3 PM.',
            'date' => now()->toDateString(),
        ]);
    }
}
