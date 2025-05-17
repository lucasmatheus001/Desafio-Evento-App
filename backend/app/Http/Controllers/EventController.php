<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\ViaCepService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    // Lista todos os eventos ativos
    public function index()
    {
        return response()->json(Event::where('is_active', true)->get());
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
            'name' => 'required|string',
            'description' => 'nullable|string',
            'zipcode' => 'required|string',
            'number' => 'required|string',
            'complement' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after_or_equal:starts_at',
            'max_subscription' => 'required|integer|min:1',
        ]);

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

        return response()->json([
            'message' => 'Evento criado com sucesso!',
            'event' => $event,
        ], 201);
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
