<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // Debug: cek semua post dulu (temporary)
        $allPosts = Post::all();
        \Log::info('All posts count:', ['count' => $allPosts->count()]);
        \Log::info('All posts:', $allPosts->map(function($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'status' => $p->status,
                'published_at' => $p->published_at?->toDateTimeString(),
                'published_at_null' => $p->published_at === null,
            ];
        })->toArray());

        // Query published posts
        $query = Post::published()
            ->with([
                'images' => fn($q) => $q->orderBy('order')->limit(3),
                'categories'
            ])
            ->latest('published_at');

        \Log::info('Published posts count:', ['count' => $query->count()]);

        // Filter featured/popular jika diperlukan
        if ($request->has('featured')) {
            $query->featured();
        }
        if ($request->has('popular')) {
            $query->popular();
        }

        $posts = $query->paginate($request->get('per_page', 24));

        return response()->json([
            'data' => $posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'thumbnail_url' => $post->thumbnail_url,
                    'full_image_url' => $post->full_image_url,
                    'external_view_url' => $post->external_view_url,
                    'categories' => $post->categories->map(fn($cat) => [
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                    ]),
                    'published_at' => $post->published_at?->toIso8601String(),
                ];
            }),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($slug)
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with(['images' => fn($q) => $q->orderBy('order')->limit(3), 'categories'])
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'thumbnail_url' => $post->thumbnail_url,
                'full_image_url' => $post->full_image_url,
                'external_view_url' => $post->external_view_url,
                'images' => $post->images->map(fn($img) => [
                    'thumbnail_url' => $img->thumbnail_url,
                    'full_image_url' => $img->full_image_url,
                    'external_view_url' => $img->external_view_url,
                ]),
                'size_info' => $post->size_info,
                'external_link' => $post->external_link,
                'categories' => $post->categories->map(fn($cat) => [
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ]),
                'published_at' => $post->published_at->toIso8601String(),
            ],
        ])
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}