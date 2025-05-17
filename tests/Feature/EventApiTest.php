<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Criar usuário autenticado para testes que precisam
        $this->user = User::factory()->create();
    }

    // Testa listagem de eventos ativos (GET /events)
    public function test_can_list_active_events()
    {
        Event::factory()->count(3)->create(['is_active' => true]);
        Event::factory()->count(2)->create(['is_active' => false]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200);
        $response->assertJsonCount(3); // Apenas ativos
    }

    // Testa mostrar detalhes de um evento (GET /events/{uuid})
    public function test_can_show_event_by_uuid()
    {
        $event = Event::factory()->create();

        $response = $this->getJson('/api/events/' . $event->uuid_code);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $event->id,
            'uuid_code' => $event->uuid_code,
            'name' => $event->name,
            // outros campos se quiser validar
        ]);
    }

    // Testa criar evento autenticado (POST /events)
    public function test_authenticated_user_can_create_event()
    {
        $payload = [
            'name' => 'Evento Teste',
            'description' => 'Descrição teste',
            'address' => 'Rua Teste, 123',
            'zipcode' => '12345678',
            'complement' => 'Sala 1',
            'number' => '123',
            'city' => 'Cidade Teste',
            'state' => 'ST',
            'starts_at' => now()->addDay()->toDateTimeString(),
            'ends_at' => now()->addDays(2)->toDateTimeString(),
            'max_subscription' => 100,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/events', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('events', [
            'name' => 'Evento Teste',
            'owner_id' => $this->user->id,
        ]);
    }

    // Testa atualizar evento pelo owner (PUT /events/{uuid})
    public function test_owner_can_update_event()
    {
        $event = Event::factory()->create(['owner_id' => $this->user->id]);

        $payload = [
            'name' => 'Nome Atualizado',
            'max_subscription' => 50,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson('/api/events/' . $event->uuid_code, $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'name' => 'Nome Atualizado',
            'max_subscription' => 50,
        ]);
    }

    // Testa deletar evento pelo owner (DELETE /events/{uuid})
    public function test_owner_can_delete_event()
    {
        $event = Event::factory()->create(['owner_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson('/api/events/' . $event->uuid_code);

        $response->assertStatus(200);
        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    // Testa inscrever usuário em evento ativo (POST /events/{uuid}/subscribe)
    public function test_user_can_subscribe_to_active_event()
    {
        $event = Event::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/events/' . $event->uuid_code . '/subscribe');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Inscrição realizada com sucesso!']);

        $this->assertDatabaseHas('event_guests', [
            'event_id' => $event->id,
            'user_id' => $this->user->id,
        ]);
    }

    // Testa erro ao tentar inscrever usuário duas vezes no mesmo evento
    public function test_user_cannot_subscribe_twice_to_same_event()
    {
        $event = Event::factory()->create(['is_active' => true]);

        EventGuest::factory()->create([
            'event_id' => $event->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/events/' . $event->uuid_code . '/subscribe');

        $response->assertStatus(422);
        $response->assertJson(['message' => 'Usuário já inscrito neste evento.']);
    }

    // Testa erro ao inscrever em eventos com conflito de horário
    public function test_user_cannot_subscribe_to_conflicting_event()
    {
        $start = now()->addDays(1);
        $end = now()->addDays(2);

        $event1 = Event::factory()->create([
            'starts_at' => $start,
            'ends_at' => $end,
            'is_active' => true,
        ]);

        $event2 = Event::factory()->create([
            'starts_at' => $start->copy()->addHour(),
            'ends_at' => $end->copy()->addHour(),
            'is_active' => true,
        ]);

        // Inscreve no primeiro evento
        EventGuest::factory()->create([
            'event_id' => $event1->id,
            'user_id' => $this->user->id,
        ]);

        // Tenta inscrever no segundo com horário conflitante
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/events/' . $event2->uuid_code . '/subscribe');

        $response->assertStatus(422);
        $response->assertJson(['message' => 'Usuário já está inscrito em outro evento nesse período.']);
    }
}
