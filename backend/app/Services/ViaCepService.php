<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViaCepService
{
    public function buscarEnderecoPorCep(string $cep): ?array
    {
        $response = Http::get("https://viacep.com.br/ws/{$cep}/json/");

        if ($response->successful() && !$response->json('erro')) {
            return $response->json();
        }

        return null;
    }
}
