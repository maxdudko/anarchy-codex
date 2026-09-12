.PHONY: up up-dev down down-dev seed logs ps

up:
	docker compose up --build

up-dev:
	docker compose -f docker-compose.dev.yml up --build

down:
	docker compose down

down-dev:
	docker compose -f docker-compose.dev.yml down

seed:
	docker compose --profile seed run --rm db-seed

logs:
	docker compose logs -f

ps:
	docker compose ps
