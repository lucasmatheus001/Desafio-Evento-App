<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\EventGuest;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_cannot_register_twice_for_same_event()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create();

        // Simula que o usuário já está inscrito
        EventGuest::factory()->create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        // Tenta se inscrever novamente
        $response = $this->actingAs($user)->postJson("/api/events/{$event->uuid_code}/subscribe");

        $response->assertStatus(422);
    }
}
