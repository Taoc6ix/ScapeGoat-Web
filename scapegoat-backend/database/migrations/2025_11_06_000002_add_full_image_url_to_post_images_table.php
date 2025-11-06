<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_images', function (Blueprint $table) {
            $table->string('full_image_url')->nullable()->after('thumbnail_url');
        });
    }

    public function down(): void
    {
        Schema::table('post_images', function (Blueprint $table) {
            $table->dropColumn('full_image_url');
        });
    }
};


