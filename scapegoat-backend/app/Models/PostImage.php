<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'thumbnail_url',
        'full_image_url',
        'external_view_url',
        'order',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}