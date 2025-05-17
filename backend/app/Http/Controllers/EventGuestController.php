<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use Illuminate\Http\Request;

class EventGuestController extends Controller
{
    // Inscreve o usuário no evento
    public function subscribe($uuid)
    {
        $user = auth()->user();

        $event = Event::where('uuid_code', $uuid)
            ->where('is_active', true)
            ->firstOrFail();

        // Verifica se já está inscrito no evento
        if (EventGuest::where('user_id', $user->id)->where('event_id', $event->id)->exists()) {
            return response()->json(['message' => 'Usuário já inscrito neste evento.'], 422);
        }

        // Verifica se já está inscrito em outro evento no mesmo horário
        $conflicting = EventGuest::where('user_id', $user->id)
            ->whereHas('event', function ($query) use ($event) {
                $query->where(function ($q) use ($event) {
                    $q->whereBetween('starts_at', [$event->starts_at, $event->ends_at])
                      ->orWhereBetween('ends_at', [$event->starts_at, $event->ends_at]);
                });
            })->exists();

        if ($conflicting) {
            return response()->json(['message' => 'Usuário já está inscrito em outro evento nesse período.'], 422);
        }

        // Inscreve o usuário
        EventGuest::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Inscrição realizada com sucesso!']);
    }
}
