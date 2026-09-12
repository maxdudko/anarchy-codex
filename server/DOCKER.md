# Docker Setup for Anarchy Codex

This document provides instructions for running the Anarchy Codex API using Docker and Docker Compose.

## 🐳 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Production Setup

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd anarchy-codex/server
   ```

2. **Start the entire stack**
   ```bash
   docker-compose up -d
   ```

3. **Check the services**
   ```bash
   docker-compose ps
   ```

4. **View logs**
   ```bash
   docker-compose logs -f api
   ```

### Development Setup

1. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Access services**
   - API: http://localhost:3001
   - MongoDB Express: http://localhost:8081 (admin/password123)
   - MongoDB: localhost:27017

## 📁 Docker Files

### Production Files
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Production stack configuration
- `.dockerignore` - Files excluded from Docker builds

### Development Files
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.dev.yml` - Development stack configuration

## 🏗 Architecture

The Docker setup includes:

1. **MongoDB Database**
   - Version: 7.0
   - Port: 27017
   - Authentication: admin/password123
   - Database: anarchy-codex
   - Persistent volume: mongodb_data

2. **Anarchy Codex API**
   - Port: 3001
   - Health check: /api/health
   - Environment variables configured
   - Persistent uploads volume

3. **MongoDB Express** (Development only)
   - Port: 8081
   - Web-based MongoDB management
   - Credentials: admin/password123

4. **Nginx** (Production only)
   - Reverse proxy
   - SSL termination
   - Load balancing ready

## 🔧 Configuration

### Environment Variables

The following environment variables are automatically configured in Docker:

```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/anarchy-codex?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Application
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=10485760
```

### Custom Environment Variables

To use custom environment variables:

1. **Create a .env file**
   ```bash
   cp .env.production .env
   # Edit .env with your values
   ```

2. **Update docker-compose.yml**
   ```yaml
   api:
     environment:
       - MONGODB_URI=${MONGODB_URI}
       - JWT_SECRET=${JWT_SECRET}
       # ... other variables
   ```

## 🚀 Commands

### Production Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Scale API instances
docker-compose up -d --scale api=3

# Stop and remove volumes
docker-compose down -v
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f api

# Rebuild development container
docker-compose -f docker-compose.dev.yml up -d --build api
```

### Database Commands

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump --out /data/backup

# Restore database
docker-compose exec mongodb mongorestore /data/backup

# Access MongoDB Express
# Open http://localhost:8081 in browser
# Username: admin, Password: password123
```

## 🔍 Monitoring

### Health Checks

The API includes health checks at `/api/health`:

```bash
# Check API health
curl http://localhost:3001/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "database": "connected",
  "version": "1.0.0"
}
```

### Container Health

```bash
# Check container health
docker-compose ps

# View health check logs
docker-compose logs api | grep health
```

## 📊 Volumes

### Persistent Data

The following volumes are created:

- `mongodb_data` - MongoDB database files
- `uploads_data` - File uploads

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect anarchy-codex-server_mongodb_data

# Backup volume
docker run --rm -v anarchy-codex-server_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore volume
docker run --rm -v anarchy-codex-server_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /data
```

## 🔒 Security

### Production Security

1. **Change default passwords**
   ```bash
   # Update MongoDB password
   docker-compose exec mongodb mongosh
   use admin
   db.changeUserPassword("admin", "new-secure-password")
   ```

2. **Use secrets for sensitive data**
   ```yaml
   # In docker-compose.yml
   secrets:
     jwt_secret:
       file: ./secrets/jwt_secret.txt
   
   services:
     api:
       secrets:
         - jwt_secret
   ```

3. **Enable SSL/TLS**
   - Configure nginx with SSL certificates
   - Use Let's Encrypt for free certificates

### Network Security

```bash
# Inspect network
docker network inspect anarchy-codex-server_anarchy-codex-network

# Connect to network
docker run --network anarchy-codex-server_anarchy-codex-network your-app
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3001
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Test connection
   docker-compose exec api node -e "
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected'))
     .catch(err => console.error(err));
   "
   ```

3. **Permission issues**
   ```bash
   # Fix uploads directory permissions
   docker-compose exec api chown -R nestjs:nodejs uploads
   ```

### Debug Mode

```bash
# Start with debug logging
docker-compose up -d
docker-compose logs -f api

# Access container shell
docker-compose exec api sh

# Check environment variables
docker-compose exec api env
```

## 📈 Performance

### Optimization Tips

1. **Resource Limits**
   ```yaml
   # In docker-compose.yml
   services:
     api:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '0.5'
   ```

2. **Database Optimization**
   ```bash
   # Create additional indexes
   docker-compose exec mongodb mongosh -u admin -p password123 anarchy-codex
   db.users.createIndex({ "email": 1 }, { unique: true })
   ```

3. **Caching**
   - Consider adding Redis for session storage
   - Implement API response caching

## 🔄 Updates

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or rolling update
docker-compose up -d --no-deps --build api
```

### Database Migrations

```bash
# Backup before migration
docker-compose exec mongodb mongodump --out /data/backup-$(date +%Y%m%d)

# Run migrations (if any)
docker-compose exec api npm run migrate

# Verify data integrity
docker-compose exec mongodb mongosh -u admin -p password123 anarchy-codex --eval "db.stats()"
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [NestJS Docker Best Practices](https://docs.nestjs.com/deployment) 