<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'preferred_sources',
        'preferred_categories',
        'preferred_authors',
    ];

    protected $casts = [
        'preferred_sources'   => 'array',
        'preferred_categories'=> 'array',
        'preferred_authors'   => 'array',
    ];

    public function getPreferredSourcesAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function getPreferredCategoriesAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function getPreferredAuthorsAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }
}