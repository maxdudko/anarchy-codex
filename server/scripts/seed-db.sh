#!/bin/bash

# Database seeding script for Docker Compose

set -e

echo "🌱 Starting database seeding..."

# stop and remove containers, networks, and volumes if they exist
docker-compose down --volumes --remove-orphans
# Remove dangling images and unused networks
docker system prune -f

# Check if MongoDB is running
if ! docker-compose ps mongodb | grep -q "Up"; then
    echo "⚠️  MongoDB is not running. Starting MongoDB first..."
    docker-compose up -d mongodb
    
    # Wait for MongoDB to be healthy
    echo "⏳ Waiting for MongoDB to be ready..."
    while ! docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 2
    done
    echo "✅ MongoDB is ready!"
fi

# Run the seeding service
echo "🚀 Running database seeding..."
docker-compose --profile seed run --rm db-seed

echo "✅ Database seeding completed successfully!"
echo ""
echo "📊 Admin credentials:"
echo "   Email: admin@anarchy-codex.com"
echo "   Password: password123"
echo ""
echo "🔍 You can view the database using MongoDB Express:"
echo "   URL: http://localhost:8081"
echo "   Username: admin"
echo "   Password: password123"
