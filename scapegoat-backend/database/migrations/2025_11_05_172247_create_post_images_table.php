<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('thumbnail_url'); // URL thumbnail dari imagebam
            $table->string('external_view_url'); // URL viewer imagebam
            $table->unsignedTinyInteger('order')->default(0); // urutan gambar (max 3)
            $table->timestamps();
            
            $table->index(['post_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_images');
    }
};