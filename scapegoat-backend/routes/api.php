<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;

Route::options('/posts', function () {
    return response()->json([])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);