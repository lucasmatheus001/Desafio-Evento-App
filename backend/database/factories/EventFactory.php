<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('+1 day', '+1 week');
        $end = (clone $start)->modify('+2 hours');

        return [
            'owner_id' => \App\Models\User::factory(),
            'uuid_code' => Str::uuid(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'zipcode' => '01001-000',
            'number' => $this->faker->buildingNumber,
            'complement' => $this->faker->secondaryAddress,
            'city' => $this->faker->city,
            'state' => $this->faker->stateAbbr,
            'address' => $this->faker->streetAddress,
            'starts_at' => $start,
            'ends_at' => $end,
            'max_subscription' => rand(10, 50),
            'is_active' => true,
        ];
    }

}
