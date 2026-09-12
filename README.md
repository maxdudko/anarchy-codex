# Anarchy Codex

Privacy-oriented community portal with articles, projects, events, a document library, and a forum. Pseudonym-based identity — no real names required.

This repository combines the former `anarchy-client` and `anarchy-server` apps into a single monorepo.

## Layout

```
anarchy-codex/
├── client/   # Next.js frontend (port 3000)
└── server/   # NestJS API + MongoDB (port 3001)
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for package-specific details.

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB (local or Docker)

### Server

```bash
cd server
npm install
# Create server/.env — see server/README.md for variables
npm run start:dev
```

API listens on `http://localhost:3001` (routes under `/api`).

Docker helpers live under `server/` (`docker-compose.yml`, `Makefile`, `DOCKER.md`).

### Client

```bash
cd client
npm install
# Create client/.env with NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

App: `http://localhost:3000`

### Convenience scripts (repo root)

```bash
npm run dev:server
npm run dev:client
```

## Former remotes

History was merged from:

- `git@github.com:maxdudko/anarchy-client.git`
- `git@github.com:maxdudko/anarchy-server.git`

## License

See package READMEs. Licensing for the combined repository will be clarified in a follow-up.
