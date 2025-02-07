<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;

// API Routes
Route::prefix('api')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Article routes
        Route::get('/articles', [ArticleController::class, 'getIndex']);
        Route::get('/articles/search', [ArticleController::class, 'search']);
        Route::get('/articles/{article}', [ArticleController::class, 'show']);


        // User preference routes
        Route::get('/user-preferences', [UserPreferenceController::class, 'show']);
        Route::put('/user-preferences', [UserPreferenceController::class, 'update']);
        Route::post('/preferences', [UserPreferenceController::class, 'store']);
        Route::get('/preferences', [UserPreferenceController::class, 'show']);

        // Authentication routes
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});