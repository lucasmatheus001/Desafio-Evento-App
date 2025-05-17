<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(5)->create()->each(function ($user) {
            \App\Models\Event::factory(2)->create(['owner_id' => $user->id])->each(function ($event) use ($user) {
                \App\Models\EventGuest::factory()->create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                ]);
            });
        });
    }

}
