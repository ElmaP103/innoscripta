<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserPreferencesTable extends Migration
{
    public function up()
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('preferred_sources')->nullable();  // Nullable JSON column
            $table->json('preferred_categories')->nullable();  // Nullable JSON column
            $table->json('preferred_authors')->nullable();  // Nullable JSON column
            $table->timestamps();
        });
        
    }

    public function down()
    {
        Schema::dropIfExists('user_preferences');
    }
} 