# News Aggregator

News Aggregator is a full‑stack application designed to aggregate and display news from diverse sources. It features a Laravel-based backend API and a React‑based frontend for a responsive user experience. The entire project is containerized using Docker and orchestrated through Docker Compose for ease of development, testing, and deployment.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Cloning the Repository](#cloning-the-repository)
  - [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Docker Setup](#docker-setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)
- [Common Commands](#common-commands)
- [License](#license)

---

## Features

- **Personalized News Feed:** Displays news tailored to user-selected preferences.
- **User Authentication:** Secure login and registration using Laravel's built-in auth.
- **Responsive UI:** Modern, dynamic interface built with React and Material‑UI.
- **API Integration:** Aggregates news via external sources and APIs.
- **Dockerized Environment:** Simplifies setup and environment consistency with Docker & Docker Compose.
- **Data Persistence:** Uses MySQL managed with Laravel migrations and Eloquent models for data integrity.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Optional: Git (to clone the repository)

---

## Getting Started

### Cloning the Repository

Clone this repository to your local environment:

```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

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
   APP_URL=http://localhost:8000

   DB_CONNECTION=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=news_aggregator
   DB_USERNAME=root
   DB_PASSWORD=root
   ```

#### Frontend

1. Navigate to the `news-aggregator-frontend` directory.
2. Create a `.env` file to configure environment variables, such as:
   
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

---

## Project Structure

```
news-aggregator/
├── docker-compose.yml
├── README.md
├── news-aggregator-backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── app/                # Laravel application code
│   ├── bootstrap/          # Contains bootstrap/app.php and related files
│   ├── config/             # Application configuration
│   ├── database/           # Migrations, seeds, and factories
│   ├── public/             # Public assets
│   ├── resources/          # Views, language files, etc.
│   ├── routes/             # Web and API routes
│   └── ...                 # Other Laravel directories/files
├── news-aggregator-frontend/
│   ├── Dockerfile
│   ├── public/
│   ├── src/                # React source code
│   └── ...                 # Other frontend files
```

---

## Docker Setup

This project leverages Docker containers to standardize the development environment.

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

#### Sample `docker-compose.yml` Excerpt

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./news-aggregator-backend
      dockerfile: Dockerfile
    container_name: news-backend
    restart: unless-stopped
    environment:
      - APP_ENV=local
      - DB_HOST=db
      - DB_DATABASE=news_aggregator
      - DB_USERNAME=root
      - DB_PASSWORD=root
    ports:
      - "8000:8000"
    volumes:
      - backend_data:/var/www/html
    depends_on:
      - db
    networks:
      - news_network

  frontend:
    build:
      context: ./news-aggregator-frontend
      dockerfile: Dockerfile
    container_name: news-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./news-aggregator-frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - news_network

  db:
    image: mysql:8.0
    container_name: news-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: news_aggregator
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - news_network

networks:
  news_network:
    driver: bridge

volumes:
  dbdata:
  backend_data:
```

---

## Running the Application

From the project root, run the following command to build and start the containers:

```bash
docker-compose up -d --build
```

This command will:

- Build the backend, frontend, and database containers.
- Initialize the Laravel application (including copying a backup for repopulation if needed).
- Expose the Laravel backend at [http://localhost:8000](http://localhost:8000) and the React frontend at [http://localhost:3000](http://localhost:3000).

---

## Database Migrations

After the containers are up, run the following command to set up your database schema:

```bash
docker-compose exec backend php artisan migrate
```

> **Note:**  
> If you encounter any migration errors related to JSON columns (e.g. default values on JSON columns are not allowed by MySQL), see the [Troubleshooting](#troubleshooting) section.

---

## Troubleshooting

### Missing Bootstrap Directory Error

- **Issue:**  
  If you encounter an error similar to:
  ```
  Failed to open required '/var/www/html/bootstrap/app.php'
  ```
  it likely means that the persistent volume (`backend_data`) is overriding the container's filesystem and the local directory does not include the required files.
  
- **Solution:**  
  The backend container's `entrypoint.sh` script will check if the critical directory (like `bootstrap`) is missing. If found missing or empty, the script copies a backup from `/app-original` (populated during the build) into `/var/www/html`. If you still see errors, try removing old volumes:
  
  ```bash
  docker-compose down -v
  docker system prune -a --volumes
  docker-compose up -d --build
  ```

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
```

---

## Common Commands

- **Access Backend Container:**
  ```bash
  docker-compose exec backend bash
  ```
  
- **Run Artisan Commands (e.g., migration, key generation, etc.):**
  ```bash
  docker-compose exec backend php artisan <command>
  ```
  
- **View Container Logs:**
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f frontend
  ```
  
- **Stop Containers:**
  ```bash
  docker-compose down
  ```

- **Clean Up Docker System (use carefully):**
  ```bash
  docker system prune -a --volumes
  ```

---

## License

This project is open-sourced under the [MIT License](LICENSE).

--- 