#!/bin/sh

# Check if critical Laravel directories are missing (caused by volume mount)
if [ ! -d "/var/www/html/bootstrap" ] || [ -z "$(ls -A /var/www/html/bootstrap)" ]; then
  echo "Critical directories missing from /var/www/html. Restoring from backup..."
  cp -R /app-original/. /var/www/html/
fi

# Ensure the vendor directory exists (install dependencies if missing)
if [ ! -d "/var/www/html/vendor" ]; then
  echo "Vendor directory missing. Running composer install..."
  composer install --no-dev --optimize-autoloader -vvv
fi

# Ensure correct ownership for Laravel directories
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor

# Generate application key if not set
if [ ! -f "/var/www/html/storage/oauth-private.key" ]; then
  echo "Generating application key..."
  php artisan key:generate
fi

# Start Laravel server
echo "Starting Laravel application..."
exec "$@"
