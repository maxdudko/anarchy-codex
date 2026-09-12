# Anarchy Codex Docker Management
# Usage: make <command>

.PHONY: help build up down logs clean dev prod test health backup restore

# Default target
help:
	@echo "Anarchy Codex Docker Management"
	@echo ""
	@echo "Available commands:"
	@echo "  build     - Build Docker images"
	@echo "  up        - Start production stack"
	@echo "  down      - Stop all containers"
	@echo "  logs      - View API logs"
	@echo "  clean     - Remove containers, networks, and volumes"
	@echo "  dev       - Start development environment"
	@echo "  dev-down  - Stop development environment"
	@echo "  prod      - Start production environment"
	@echo "  test      - Run tests in container"
	@echo "  health    - Check service health"
	@echo "  backup    - Backup MongoDB data"
	@echo "  restore   - Restore MongoDB data"
	@echo "  shell     - Access API container shell"
	@echo "  mongo     - Access MongoDB shell"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f api

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

prod:
	docker-compose up -d --build

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f api

dev-shell:
	docker-compose -f docker-compose.dev.yml exec api sh

# Testing
test:
	docker-compose exec api npm run test

test-e2e:
	docker-compose exec api npm run test:e2e

# Health checks
health:
	@echo "Checking API health..."
	@curl -s http://localhost:3001/api/health | jq . || echo "API not responding"
	@echo ""
	@echo "Checking container status..."
	@docker-compose ps

# Database operations
backup:
	@echo "Creating MongoDB backup..."
	@docker-compose exec mongodb mongodump --out /data/backup-$(shell date +%Y%m%d-%H%M%S)
	@echo "Backup completed"

restore:
	@echo "Restoring MongoDB data..."
	@docker-compose exec mongodb mongorestore /data/backup-$(shell date +%Y%m%d-%H%M%S)

# Shell access
shell:
	docker-compose exec api sh

mongo:
	docker-compose exec mongodb mongosh -u admin -p password123 anarchy-codex

mongo-express:
	@echo "MongoDB Express available at: http://localhost:8081"
	@echo "Username: admin, Password: password123"

# Monitoring
status:
	@echo "Container Status:"
	@docker-compose ps
	@echo ""
	@echo "Resource Usage:"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Security
change-passwords:
	@echo "Changing MongoDB admin password..."
	@docker-compose exec mongodb mongosh --eval "use admin; db.changeUserPassword('admin', 'new-secure-password')"

# Scaling
scale:
	docker-compose up -d --scale api=3

# Updates
update:
	git pull origin main
	docker-compose down
	docker-compose up -d --build

# Quick start for new developers
quickstart:
	@echo "Setting up Anarchy Codex for development..."
	@make dev
	@echo "Waiting for services to start..."
	@sleep 10
	@make health
	@echo ""
	@echo "Development environment ready!"
	@echo "API: http://localhost:3001"
	@echo "MongoDB Express: http://localhost:8081"
	@echo "MongoDB: localhost:27017" 