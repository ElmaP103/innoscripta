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
            $searchTerm = $request->query('search');
            $source = $request->query('source');
            $category = $request->query('category');
            $author = $request->query('author');
            $date = $request->query('date');

            \Log::info('Search parameters received:', [
                'search' => $searchTerm,
                'source' => $source,
                'category' => $category,
                'author' => $author,
                'date' => $date
            ]);

            $query = Article::query();

            // Start a single where clause that combines all conditions with AND
            $query->where(function ($mainQuery) use ($searchTerm, $source, $category, $author, $date) {
                // Search term condition (title OR content)
                if ($searchTerm) {
                    $searchLower = strtolower($searchTerm);
                    $mainQuery->where(function ($q) use ($searchLower) {
                        $q->where('title', 'like', '%' . $searchLower . '%')
                            ->orWhere('content', 'like', '%' . $searchLower . '%');
                    });
                }

                // AND source condition
                if ($source) {
                    $mainQuery->where('source', $source);
                }

                // AND category condition
                if ($category) {
                    $mainQuery->where('category', $category);
                }

                // AND author condition
                if ($author) {
                    $mainQuery->where('author', $author);
                }

                // AND date condition
                if ($date) {
                    $searchDate = date('Y-m-d', strtotime($date));
                    $mainQuery->whereRaw('DATE(published_at) = ?', [$searchDate]);
                }
            });

            // Log the constructed query
            \Log::info('Final search query:', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings()
            ]);

            // Get sample of matching data
            $sampleBeforeExecution = $query->limit(3)->get();
            \Log::info('Sample matching data:', [
                'sample_count' => $sampleBeforeExecution->count(),
                'samples' => $sampleBeforeExecution->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'source' => $article->source,
                        'category' => $article->category,
                        'author' => $article->author,
                        'published_at' => $article->published_at
                    ];
                })
            ]);

            // Execute final paginated query
            $articles = $query->latest('published_at')->paginate(15);

            // Log results
            \Log::info('Search results:', [
                'total_results' => $articles->total(),
                'current_page' => $articles->currentPage(),
                'per_page' => $articles->perPage(),
                'conditions_used' => [
                    'search_term' => !empty($searchTerm),
                    'source' => !empty($source),
                    'category' => !empty($category),
                    'author' => !empty($author),
                    'date' => !empty($date)
                ]
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $articles
            ]);

        } catch (\Exception $e) {
            \Log::error('Search error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to search articles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get articles based on user preferences
     */

}
