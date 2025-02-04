<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user()->preferences);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'array',
            'sources' => 'array',
        ]);

        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json($preferences);
    }
}

