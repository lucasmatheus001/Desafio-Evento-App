<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventGuestController; // ← NOVA LINHA

// Rota para pegar o usuário autenticado
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Rotas públicas
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{uuid}', [EventController::class, 'show']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{uuid}', [EventController::class, 'update']);
    Route::delete('/events/{uuid}', [EventController::class, 'destroy']);
    Route::post('/events/{uuid}/subscribe', [EventGuestController::class, 'subscribe']);
});
