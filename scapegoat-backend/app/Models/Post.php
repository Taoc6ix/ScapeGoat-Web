<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail_url',
        'full_image_url',
        'external_view_url',
        'size_info',
        'external_link',
        'is_featured',
        'is_popular',
        'status',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug dari title
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title) . '-' . time();
            }
        });
    }

    // Relationships
    public function images()
    {
        return $this->hasMany(PostImage::class)->orderBy('order');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }
}