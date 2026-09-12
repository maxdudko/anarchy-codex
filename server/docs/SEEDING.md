# Database Seeding

This document explains how to seed the database with initial data for the Anarchy Codex application.

## Overview

The database seeding system creates:
- An admin user with login credentials
- Sample news articles with proper author relationships

## Quick Start

### Method 1: Using Docker Compose (Recommended)

```bash
# Seed the database with Docker Compose
npm run seed:docker

# Or run the script directly
./scripts/seed-db.sh
```

### Method 2: Complete Reset and Seed

```bash
# Stop containers, remove volumes, and reseed
npm run seed:reset
```

### Method 3: Local Development

```bash
# Make sure MongoDB is running locally
npm run seed
```

## What Gets Seeded

### Admin User
- **Email**: admin@anarchy-codex.com
- **Password**: password123
- **Role**: admin
- **Name**: Admin User

### News Articles
- 10 sample news articles
- All articles are published and ready to view
- Proper author relationships with the admin user

## Database Access

After seeding, you can access the database through:

### MongoDB Express (Web Interface)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: password123

### Direct MongoDB Connection
- **URI**: mongodb://admin:password123@localhost:27017/anarchy-codex?authSource=admin

## Docker Compose Profiles

The seeding service uses Docker Compose profiles:

- `seed`: Run only the seeding service
- `dev`: Include seeding service in development environment

```bash
# Run with specific profile
docker-compose --profile seed up

# Run in development mode (includes seeding)
docker-compose --profile dev up
```

## Customizing Seed Data

To modify the seed data:

1. Edit `seeds/seed.ts`
2. Update the `newsList` array with your desired articles
3. Modify the admin user creation if needed
4. Run the seeding command again

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB container is running and healthy
- Check that the connection string matches your setup
- Verify that the database user has proper permissions

### Seeding Fails
- Check Docker logs: `docker-compose logs db-seed`
- Verify that TypeScript compilation is successful
- Ensure all dependencies are installed

### Permission Errors
- Make sure the seeding script is executable: `chmod +x scripts/seed-db.sh`
- Check Docker permissions on your system

## Files Structure

```
├── seeds/
│   └── seed.ts              # Main seeding script
├── scripts/
│   └── seed-db.sh          # Convenience script for Docker
├── Dockerfile.seed         # Docker image for seeding
└── docker-compose.yml      # Contains db-seed service
```

## Environment Variables

The seeding script uses these environment variables:

- `MONGODB_URI`: Database connection string
- `NODE_ENV`: Environment (development/production)

These are automatically set in the Docker Compose configuration.
