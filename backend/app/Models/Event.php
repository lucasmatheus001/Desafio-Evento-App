<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'uuid_code',
        'name',
        'description',
        'address',
        'zipcode',
        'complement',
        'number',
        'city',
        'state',
        'starts_at',
        'ends_at',
        'max_subscription',
        'is_active',
    ];
    
    public function guests()
    {
        return $this->hasMany(EventGuest::class);
    }
    
}
