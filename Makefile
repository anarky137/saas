.PHONY: help install dev up down build lint test clean logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

up: ## Start infrastructure (docker compose)
	docker compose up -d
	@echo "Waiting for services..."
	@sleep 5
	@echo "Services running: Postgres:5432, Redis:6379, Kafka:9092"

down: ## Stop infrastructure
	docker compose down

down-v: ## Stop infrastructure and remove volumes
	docker compose down -v

logs: ## Show docker logs
	docker compose logs -f

logs-kafka: ## Show Kafka logs
	docker compose logs -f kafka

logs-postgres: ## Show Postgres logs
	docker compose logs -f postgres

build: ## Build all projects
	pnpm nx run-many -t build

build-auth: ## Build auth-service
	pnpm nx build auth-service

build-user: ## Build user-service
	pnpm nx build user-service

build-notification: ## Build notification-service
	pnpm nx build notification-service

dev-auth: ## Run auth-service in dev mode
	pnpm exec tsx apps/auth-service/src/main.ts

dev-user: ## Run user-service in dev mode
	pnpm exec tsx apps/user-service/src/main.ts

dev-notification: ## Run notification-service in dev mode
	pnpm exec tsx apps/notification-service/src/main.ts

dev-gateway: ## Run api-gateway in dev mode
	pnpm exec tsx apps/api-gateway/src/main.ts

dev-web: ## Run web (Next.js)
	pnpm nx dev web

typecheck: ## TypeScript check all projects
	pnpm nx run-many -t typecheck

lint: ## Lint all projects
	pnpm nx run-many -t lint

test: ## Run all tests
	pnpm nx run-many -t test

clean: ## Clean build artifacts
	pnpm nx reset
	rm -rf dist node_modules/.cache

ps: ## Show docker compose status
	docker compose ps

restart: down up ## Restart infrastructure
