#!/bin/bash

# Check if migrations have been applied
echo "Checking if Prisma migrations have been applied..."

# This will check if a database exists or whether seeding has already been done
if [ ! -f "/data/.migrated" ]; then
    echo "Applying Prisma migrations..."
    npx prisma migrate deploy

    echo "Running Prisma seed..."
    npm run seed

    # Mark that the migrations and seeding are done
    touch /data/.migrated
else
    echo "Migrations already applied and database seeded."
fi

# Continue with the normal container start process
exec "$@"
