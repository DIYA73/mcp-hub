# 🗂️ MCP Hub

**Self-hosted MCP server registry and proxy** — register, proxy, and monitor any MCP server from one place.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-queue-FF0000?style=flat)

---

## What it does

MCP Hub acts as a central registry and reverse proxy in front of your MCP servers. Instead of configuring each AI agent to talk directly to each MCP server, you point every agent at MCP Hub and it routes requests, logs traffic, and health-checks servers in the background.

```
AI agent / Claude
       │
       ▼
   MCP Hub (this repo)
       │
  ┌────┴────┬──────────┐
  ▼         ▼          ▼
MCP         MCP        MCP
Server A  Server B   Server C
```

## Features

- **Registry** — register MCP servers by URL; store name, metadata, and connection config
- **Proxy** — route MCP protocol requests to the correct upstream server
- **Health monitoring** — background BullMQ job pings each registered server; marks offline servers
- **Live logs** — WebSocket gateway streams proxy logs to the dashboard in real time
- **REST API** — full CRUD for server registry; queryable logs

## Tech stack

| Layer    | Technology                     |
|----------|--------------------------------|
| API      | NestJS 10, TypeScript          |
| Database | PostgreSQL (TypeORM)           |
| Cache    | Redis                          |
| Queue    | BullMQ (health check jobs)     |
| Realtime | WebSocket gateway (NestJS)     |

## Project structure

```
mcp-hub/src/
├── proxy/      # Request proxying to upstream MCP servers
├── health/     # BullMQ health check processor
├── logs/       # Log storage + WebSocket streaming gateway
└── common/     # Shared types
```

## Quick start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### 1. Clone and configure

```bash
git clone https://github.com/DIYA73/mcp-hub.git
cd mcp-hub
cp .env.example .env   # if present, or create manually
```

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/mcphub
REDIS_URL=redis://localhost:6379
PORT=3000
```

### 2. Install and run

```bash
npm install
npm run start:dev
```

### 3. Register an MCP server

```bash
curl -X POST http://localhost:3000/servers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-filesystem-mcp",
    "url": "http://localhost:8080",
    "description": "Local filesystem MCP server"
  }'
```

### 4. Proxy a request

```bash
curl -X POST http://localhost:3000/proxy/my-filesystem-mcp \
  -H "Content-Type: application/json" \
  -d '{ "method": "tools/list", "params": {} }'
```

## API reference

```
GET    /servers              # list registered MCP servers
POST   /servers              # register a new server
GET    /servers/:id          # server detail + health status
DELETE /servers/:id          # remove server

GET    /logs                 # recent proxy logs
GET    /logs/:serverId       # logs for a specific server

WS     /logs/stream          # live WebSocket log feed
```

## Contributing

PRs welcome. Open an issue first for major changes.

## License

MIT