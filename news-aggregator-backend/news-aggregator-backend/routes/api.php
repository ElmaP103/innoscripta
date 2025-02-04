<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/articles', [ArticleController::class, 'index']);
        Route::get('/articles/{article}', [ArticleController::class, 'show']);
        Route::get('/articles/search', [ArticleController::class, 'search']);
        Route::get('/user-preferences', [UserPreferenceController::class, 'show']);
        Route::put('/user-preferences', [UserPreferenceController::class, 'update']);
        Route::get('/preferences', [UserPreferenceController::class, 'show']);
        Route::post('/preferences', [UserPreferenceController::class, 'update']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
