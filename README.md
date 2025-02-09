# News Aggregator

News Aggregator is a full‑stack application designed to aggregate and display news from diverse sources. It features a Laravel-based backend API and a React‑based frontend for a responsive user experience. The entire project is containerized using Docker and orchestrated through Docker Compose for ease of development, testing, and deployment.


## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Cloning the Repository](#cloning-the-repository)
  - [Environment Setup](#environment-setup)
- [Docker Setup](#docker-setup)
  - [Backend](#backend)
  - [Database](#database)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Common Commands](#common-commands)
- [License](#license)
- [Setup and Running without Docker](#setup-and-running-without-docker)


## Features

- Personalized News Feed: Displays news tailored to user-selected preferences.
- User Authentication: Secure login and registration using Laravel's built-in auth.
- Responsive UI with React and Material‑UI.
- API Integration: Aggregates news via external sources and APIs.
- Dockerized Environment: Simplifies setup and environment consistency with Docker & Docker Compose.
- Data Persistence: Uses MySQL managed with Laravel migrations and Eloquent models for data integrity.


## Getting Started

### Cloning the Repository

git clone https://github.com/ElmaP103/innoscripta
cd innoscripta


### Environment Setup

#### Backend

1. Navigate to the `news-aggregator-backend` directory.
2. Ensure that you have an `.env.example` file in this directory.  
   The Dockerfile will copy `.env.example` to `.env` during the build process.
3. In `.env.example`, adjust settings as needed (especially for the database). For example:

   ```env
   APP_NAME=Laravel
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost

   DB_CONNECTION=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=news_aggregator
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   You should also set NEWS_API_KEY in .env from NewsAPI.org.

## Docker Setup

### Backend

- **Dockerfile:**  
  - Copies the Laravel application code including essential directories: `app`, `bootstrap`, `config`, and more.
  - Creates a backup of the fully built application in `/app-original` for repopulating data if a volume mount causes missing files.
  - Uses an entrypoint script (`entrypoint.sh`) that checks if critical directories (such as `bootstrap`) exist in `/var/www/html`. If missing, it copies the backup into the mounted volume.

### Frontend

- **Dockerfile:**  
  - Builds the React application.
  - Mounts the source code from the host for live reloading.

### Database

- **MySQL Container:**  
  - Uses official MySQL 8.0 image.
  - Persists data in a named volume (`dbdata`).

###
## Running the Application

From the project root, run the following command to build and start the containers:
```bash
docker-compose up -d --build

This command will:

- Build the backend, frontend, and database containers.
- Initialize the Laravel application (including copying a backup for repopulation if needed).
- Expose the Laravel backend at [http://localhost:8001](http://localhost:8001) and the React frontend at [http://localhost:3000](http://localhost:3000).


## Database Migrations

After the containers are up, run the following command to set up your database schema:

docker-compose exec backend php artisan migrate

> **Note:**  

## Troubleshooting

### Missing Bootstrap Directory Error

- **Issue:**  
  If you encounter an error similar to:

  Failed to open required '/var/www/html/bootstrap/app.php'

  it likely means that the persistent volume (`backend_data`) is overriding the container's filesystem and the local directory does not include the required files.
  
- **Solution:**  
  The backend container's `entrypoint.sh` script will check if the critical directory (like `bootstrap`) is missing. If found missing or empty, the script copies a backup from `/app-original` (populated during the build) into `/var/www/html`. If you still see errors, try removing old volumes:
  
```bash
  docker-compose down -v
  docker system prune -a --volumes
  docker-compose up -d --build


### Migration Errors with JSON Columns

- **Issue:**  
  MySQL does not support default values on JSON columns.  
- **Solution:**  
  If you previously ran a migration that set a default for JSON columns (such as for `preferred_sources`), create a new migration to alter those columns and remove the default value. Ensure your model casts those columns to arrays. See the [UserPreference Model](#userpreference-model) section below.

### UserPreference Model

Make sure your `UserPreference` model correctly casts JSON columns and provides default empty arrays if needed. An example:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'preferred_sources',
        'preferred_categories',
        'preferred_authors',
    ];

    protected $casts = [
        'preferred_sources'    => 'array',
        'preferred_categories' => 'array',
        'preferred_authors'    => 'array',
    ];

    public function getPreferredSourcesAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function getPreferredCategoriesAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function getPreferredAuthorsAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }
}
or you can modify the migration to remove the default value.
you should consider the following:(in database/migrations/_**_**_**_create_user_preferences_table.php)
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

## Common Commands

- **Access Backend Container:**
```bash
  docker-compose exec backend bash
  
- **Run Artisan Commands (e.g., migration, key generation, etc.):**
  ```bash
  docker-compose exec backend php artisan <command>
  
  
- **View Container Logs:**
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f frontend
  
  
- **Stop Containers:**
  ```bash
  docker-compose down
  

- **Clean Up Docker System (use carefully):**
  ```bash
  docker system prune -a --volumes

  ##setup-and-running-without-docker
    ### Prerequisites
        - PHP 8.1 or higher
        - Composer
        - Node.js 16+ and npm
        - MySQL 8.0
        - Git
    ### Backend Setup
         cd news-aggregator-backend
         composer install
         cp .env.example .env
         php artisan key:generate
         php artisan migrate
         php artisan serve:withscheduler
         
    ### Frontend Setup
         cd news-aggregator-frontend
         npm install (npm install)
         npm start
         
         
         
