# Anarchy Codex

Privacy-oriented community portal with articles, projects, events, a document library, and a forum. Pseudonym-based identity — no real names required.

This repository combines the former `anarchy-client` and `anarchy-server` apps into a single monorepo.

## Layout

```
anarchy-codex/
├── client/                 # Next.js frontend (port 3000)
├── server/                 # NestJS API (port 3001)
├── docker-compose.yml      # Full stack (Mongo + API + client)
├── docker-compose.dev.yml  # Dev stack with hot reload
└── .env.example            # Compose / app env template
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for package-specific details.

## Docker (recommended)

Copy env defaults, then start the stack from the repo root:

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Client | http://localhost:3000 |
| API | http://localhost:3001/api |
| MongoDB | localhost:27017 |

Optional profiles:

```bash
# Seed sample data (one-shot)
docker compose --profile seed run --rm db-seed

# Mongo Express UI
docker compose --profile tools up mongo-express
```

### Development Compose (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

This mounts `client/` and `server/` for live reload. Mongo Express is included on port 8081.

Legacy server-only Compose files remain under `server/` if you only need the API + Mongo.

## Local (without Docker)

### Prerequisites

- Node.js 18+
- MongoDB (local or `docker compose up mongodb`)

### Server

```bash
cd server
npm install
# Create server/.env — see server/README.md for variables
npm run start:dev
```

### Client

```bash
cd client
npm install
# Create client/.env with NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

### Convenience scripts (repo root)

```bash
npm run dev:server
npm run dev:client
npm run docker:up
npm run docker:up:dev
npm run docker:down
```

## Former remotes

History was merged from:

- `git@github.com:maxdudko/anarchy-client.git`
- `git@github.com:maxdudko/anarchy-server.git`

## License

Unlicensed — Сreated by an anarchist for anarchists
