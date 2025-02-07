<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\UserPreference;

class UserPreferenceController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log the entire request
            \Log::info('PreferencesController@store called', [
                'request_method' => $request->method(),
                'request_headers' => $request->headers->all(),
                'request_body' => $request->all(),
                'user_agent' => $request->userAgent()
            ]);

            $user = auth()->user();

            // Log user context
            \Log::info('User context:', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'existing_preferences' => $user->preferences
            ]);

            // Get the preferences data
            $sources = $request->input('sources', []);
            $categories = $request->input('categories', []);
            $authors = $request->input('authors', []);

            // Log detailed preferences data
            \Log::info('Processing preferences:', [
                'sources' => $sources,
                'categories' => $categories,
                'authors' => $authors,
                'sources_type' => gettype($sources),
                'categories_type' => gettype($categories),
                'authors_type' => gettype($authors)
            ]);

            // Update or create preferences
            $preferences = UserPreference::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'preferred_sources' => $sources,
                    'preferred_categories' => $categories,
                    'preferred_authors' => $authors
                ]
            );

            \Log::info('Saved preferences:', [
                'preference_id' => $preferences->id,
                'saved_data' => $preferences->toArray(),
                'was_created' => $preferences->wasRecentlyCreated,
                'was_updated' => $preferences->wasChanged()
            ]);

            // Build query for articles based on preferences
            $query = Article::query();

            if (!empty($sources)) {
                $query->whereIn('source', $preferences->preferred_sources);
            }
            if (!empty($categories)) {
                $query->whereIn('category', $preferences->preferred_categories);
            }
            if (!empty($authors)) {
                $query->whereIn('author', $preferences->preferred_authors);
            }

            $articles = $query->latest('published_at')->paginate(15);

            // Log the query results
            \Log::info('Preferences query results:', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings(),
                'results_count' => $articles->count()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'preferences' => $preferences,
                    'articles' => $articles
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Preferences store error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save preferences: ' . $e->getMessage()
            ], 500);
        }
    }
}