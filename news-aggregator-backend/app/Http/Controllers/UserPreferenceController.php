<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            // Handle empty values properly
            $sources = !empty($request->sources) ? implode(',', $request->sources) : null;
            $categories = !empty($request->categories) ? implode(',', $request->categories) : null;
            $authors = !empty($request->authors) && !empty($request->authors[0]) ? implode(',', $request->authors) : null;

            $preferences = UserPreference::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'sources' => $sources,
                    'categories' => $categories,
                    'authors' => $authors
                ]
            );

            // Get articles based on preferences
            $query = Article::query();

            if (!empty($sources)) {
                $query->whereIn('source', explode(',', $sources));
            }
            if (!empty($categories)) {
                $query->whereIn('category', explode(',', $categories));
            }
            if (!empty($authors)) {
                $query->whereIn('author', explode(',', $authors));
            }

            $articles = $query->latest('published_at')->paginate(15);

            return response()->json([
                'status' => 'success',
                'message' => 'Preferences saved successfully',
                'data' => [
                    'preferences' => $preferences,
                    'articles' => $articles
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error saving preferences: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save preferences'
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $preferences = UserPreference::where('user_id', $user->id)->first();

            // Get filtered articles based on stored preferences
            $query = Article::query();

            if ($preferences) {
                if (!empty($preferences->sources)) {
                    $sources = explode(',', $preferences->sources);
                    $query->whereIn('source', $sources);
                }
                if (!empty($preferences->categories)) {
                    $categories = explode(',', $preferences->categories);
                    $query->whereIn('category', $categories);
                }
                if (!empty($preferences->authors)) {
                    $authors = explode(',', $preferences->authors);
                    $query->whereIn('author', $authors);
                }
            }

            $articles = $query->latest('published_at')->paginate(15);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'preferences' => $preferences,
                    'articles' => $articles
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching preferences: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch preferences'
            ], 500);
        }
    }
}