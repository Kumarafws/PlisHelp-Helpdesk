# PlisHelp Laravel Backend

Backend scaffold only; intentionally not connected to the Next.js frontend yet.

## Setup
1. Start from a fresh Laravel 12 application and copy this directory's `app`, `database`, and `routes` folders.
2. Run `composer install`, configure `.env` from `.env.example`, then run `php artisan migrate --seed`.
3. API routes are available under `/api/v1` and use Sanctum-compatible token authentication.

Demo seed passwords are `password` for local development only. Replace them before any real deployment.
