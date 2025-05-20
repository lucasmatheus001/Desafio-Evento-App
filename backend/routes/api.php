<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventGuestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// Rota para pegar o usuário autenticado
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

// Rotas públicas
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{uuid}', [EventController::class, 'show']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{uuid}', [EventController::class, 'update']);
    Route::delete('/events/{uuid}', [EventController::class, 'destroy']);
    Route::post('/events/{uuid}/subscribe', [EventGuestController::class, 'subscribe']);
    Route::get('/events/{uuid}/subscription-status', [EventGuestController::class, 'checkSubscriptionStatus']);
    Route::get('/my-subscriptions', [EventController::class, 'mySubscriptions']);
    Route::delete('/event/{uuid}/unsubscribe', [EventGuestController::class, 'unsubscribe']);
});
