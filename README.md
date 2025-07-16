# dojo-log-api

## Overview

dojo-log-api is a Node.js/TypeScript RESTful API that serves the [Dojologs](https://www.dojologs.com/) mobile app; a consistency companion app for setting goals and tracking progress. It uses Express, Sequelize (PostgreSQL), and is containerized with Docker for easy deployment.

---

## Architecture

### Clean Architecture
The codebase adopts Clean Architecture principles; Clean Architecture is a software design philosophy that emphasizes separation of concerns, testability, and independence from frameworks and external agencies. The core idea is to organize code into concentric layers:
- **Entities**: Core business logic and domain models, independent of frameworks or external systems.
- **Use Cases**: Application-specific business rules, orchestrating entities to fulfill user stories or workflows.
- **Adapters**: Interface adapters (controllers, middleware, presenters) that translate data between the outside world (HTTP, DB, UI) and the core logic.
- **Infrastructure**: Frameworks, databases, and external services implementations.

This approach makes the codebase easier to test, maintain, and adapt to new requirements or technologies.

### Microservices Architecture

The dojo-log-api Node API is part of the overall Dojologs microservices eco system.

**Architectural diagram**

![Dojologs Architecture](./Dojologs_architecture_diagram.drawio.svg)

**List of associated services**
- [dojo-log-ui](https://github.com/megame24/dojo-log-ui)
- [dojologs-apple-sign-in-service](https://github.com/megame24/dojologs-apple-sign-in-service)
- [dojologs-google-sign-in-service](https://github.com/megame24/dojologs-google-sign-in-service)
- [dojo-log-goal-notification-service](https://github.com/megame24/dojo-log-goal-notification-service)
- [dojologs-logbook-notification-service](https://github.com/megame24/dojologs-logbook-notification-service)
- [dojologs-expo-notification-service](https://github.com/megame24/dojologs-expo-notification-service)

**Core technology**

- **Express**: Main web server framework.
- **Sequelize**: ORM for PostgreSQL database access.
- **TypeScript**: Source code in `src/`, compiled to `build/`.
- **Docker**: For local development and deployment, with a multi-stage Dockerfile and `docker-compose.yml` for API and database.
- **Scripts**: Helper scripts in `bin/` for starting, stopping, and managing containers.

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)


### 1. Clone the Repository
```sh
git clone https://github.com/megame24/dojo-log-api.git
cd dojo-log-api
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory, using `.env-sample` as reference

### 3. Start with Docker
This will build and start both the API and PostgreSQL database:
```sh
./bin/start.sh
```
- To stop containers: `./bin/stop.sh`
- To access the API container shell: `./bin/dockerBash.sh`

---

## Project Structure
- `src/index.ts` - Entry point
- `src/modules/` - Main business logic, organized by domain and Clean Architecture layers:
  - `adapters/` - Controllers, middleware, and interface adapters
  - `entities/` - Domain models and business logic
  - `infrastructure/` - Database, services, and framework-specific code
  - `useCases/` - Application-specific business rules
- `bin/` - Shell scripts for Docker/dev tasks
- `build/` - Compiled output

---

## API Endpoints
API endpoints are organized by resource (logbook, users, etc.). See the code in `src/modules/*/infrastructure/routes/` for details.

---

## Testing
- Uses Jest for unit/integration tests
- Run tests with `npm test`

---

## Linting & Formatting
- ESLint and Prettier are configured
- Pre-commit hooks via Husky and lint-staged

---

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## Contact
For issues, open a ticket at [GitHub Issues](https://github.com/megame24/dojo-log-api/issues)