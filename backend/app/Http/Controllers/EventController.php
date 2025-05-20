<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\ViaCepService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\EventGuest;

class EventController extends Controller
{
    // Lista todos os eventos ativos
    public function index()
    {
        return response()->json(Event::where('starts_at', '>=', now())
            ->where('is_active', true)
            ->orderBy('starts_at' , 'desc')
            ->get());
    }

    // Mostra detalhes de um evento específico
    public function show($uuid)
    {
        $event = Event::where('uuid_code', $uuid)->firstOrFail();
        return response()->json($event);
    }

    // Cria um novo evento com busca de endereço via CEP
    public function store(Request $request, ViaCepService $viaCep)
    {
        $request->validate([
            'uuid_code' => 'generated',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'zipcode' => 'required|string',
            'number' => 'required|string',
            'complement' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after_or_equal:starts_at',
            'max_subscription' => 'required|integer|min:1',
            'is_active' => nullable|boolean,
        ]);

        

        if (!Auth::check()) {
            return response()->json(['error' => 'Usuário não autenticado.'], 401);
        }

        // Buscar dados do endereço pelo CEP
        $endereco = $viaCep->buscarEnderecoPorCep($request->zipcode);

        if (!$endereco) {
            return response()->json(['error' => 'CEP inválido ou não encontrado.'], 422);
        }

        $event = Event::create([
            'owner_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
            'zipcode' => $request->zipcode,
            'number' => $request->number,
            'complement' => $request->complement,
            'city' => $endereco['localidade'] ?? '',
            'state' => $endereco['uf'] ?? '',
            'address' => $endereco['logradouro'] ?? '',
            'starts_at' => $request->starts_at,
            'ends_at' => $request->ends_at,
            'max_subscription' => $request->max_subscription,
            'is_active' => true,
        ]);

        EventGuest::create([
            'event_id' => $event->id,
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Evento criado com sucesso!',
            'event' => $event,
        ], 201);

    }

    public function checkSubscriptionStatus($uuid)
    {
        $user = auth()->user();

        $event = Event::where('uuid_code', $uuid)->where('is_active', true)->firstOrFail();

        $alreadySubscribed = EventGuest::where('user_id', $user->id)->where('event_id', $event->id)->exists();

        $hasConflict = EventGuest::where('user_id', $user->id)
            ->whereHas('event', function ($query) use ($event) {
                $query->where(function ($q) use ($event) {
                    $q->whereBetween('starts_at', [$event->starts_at, $event->ends_at])
                    ->orWhereBetween('ends_at', [$event->starts_at, $event->ends_at]);
                });
            })
            ->where('event_id', '!=', $event->id) // diferente do atual
            ->exists();

        return response()->json([
            'already_subscribed' => $alreadySubscribed,
            'has_conflict' => $hasConflict,
            'is_owner' => $event->owner_id === $user->id,
        ]);
    }

    public function mySubscriptions(Request $request)
    {
        $user = $request->user();

        $events = Event::whereHas('guests', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        return response()->json($events);
    }

    // Atualiza um evento
    public function update(Request $request, $uuid)
    {
        $event = Event::where('uuid_code', $uuid)
            ->where('owner_id', auth()->id())
            ->firstOrFail();

        $data = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'address' => 'sometimes|string',
            'zipcode' => 'sometimes|string',
            'complement' => 'nullable|string',
            'number' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'sometimes|date|after_or_equal:starts_at',
            'max_subscription' => 'sometimes|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $event->update($data);

        return response()->json($event);
    }

    // Remove (soft delete) um evento
    public function destroy($uuid)
    {
        $event = Event::where('uuid_code', $uuid)
            ->where('owner_id', auth()->id())
            ->firstOrFail();

        $event->delete();

        return response()->json(['message' => 'Evento removido com sucesso.']);
    }
}
