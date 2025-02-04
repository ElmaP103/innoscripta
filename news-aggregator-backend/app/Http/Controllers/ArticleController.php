<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::query();

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('content', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        if ($request->has('date')) {
            $query->whereDate('published_at', $request->date);
        }

        return $query->orderBy('published_at', 'desc')->paginate(15);
    }

    public function show(Article $article)
    {
        return $article;
    }

    public function search(Request $request)
    {
        $query = Article::query();

        if ($request->has('q')) {
            $query->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%');
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('date')) {
            $query->whereDate('published_at', $request->date);
        }

        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        return $query->paginate(10);
    }
}
