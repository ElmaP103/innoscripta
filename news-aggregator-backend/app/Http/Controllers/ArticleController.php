<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        try {
            \Log::info('ArticleController index method called', [
                'user_id' => $request->user()->id ?? 'no user',
                'token' => $request->bearerToken() ?? 'no token'
            ]);

            $articles = Article::query()
                ->latest('published_at')
                ->paginate(15);

            \Log::info('Fetched articles:', [
                'count' => $articles->count(),
                'total' => $articles->total()
            ]);

            return $articles;

        } catch (\Exception $e) {
            \Log::error('Error fetching articles: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch articles'
            ], 500);
        }
    }

    public function show(Article $article)
    {
        try {
            // Load any relationships if needed
            // $article->load('comments', 'author', etc);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'article' => $article
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch article details'
            ], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = Article::query();

            if ($request->has('search')) {
                $searchTerm = strtolower($request->search);
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(title) LIKE ?', ['%' . $searchTerm . '%'])
                        ->orWhereRaw('LOWER(description) LIKE ?', ['%' . $searchTerm . '%']);
                });
            }

            if ($request->has('category')) {
                $query->whereRaw('LOWER(category) = ?', [strtolower($request->category)]);
            }

            if ($request->has('date')) {
                $query->whereDate('published_at', $request->date);
            }

            if ($request->has('source')) {
                $query->whereRaw('LOWER(source) = ?', [strtolower($request->source)]);
            }

            $articles = $query->latest('published_at')->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $articles
            ]);
        } catch (\Exception $e) {
            \Log::error('Search error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to perform search'
            ], 500);
        }
    }

    /**
     * Get articles based on user preferences
     */

}
