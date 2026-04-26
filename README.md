# Technical Test Monorepo

This repository contains a full-stack technical test implementation with two primary projects:

- `backend/` — a Python FastAPI backend using a layered architecture.
- `frontend/` — a React frontend organized using a feature-based architecture.

Both projects are built with maintainability, separation of concerns, and good engineering practices in mind.

---

## Backend Architecture

The backend in `backend/` is structured as a layered or "clean" API service. The main layers are:

- `api/` — FastAPI route definitions and HTTP request handling.
- `services/` — business logic, orchestration, and external API integration.
- `repository/` — persistence layer that writes audit records and session state to MongoDB.
- `schema/` — request/response models, DTOs, and validation schemas.
- `model/` — database model abstractions and MongoDB helpers.
- `util/` — shared utilities, dependency providers, HTTP client configuration, and settings.

### Backend Design Patterns

The backend uses several established patterns:

- **Layered architecture** — each layer has a clear responsibility and communicates through well-defined interfaces.
- **Repository pattern** — `operation_repository.py` and `session_repository.py` encapsulate MongoDB persistence operations.
- **Service layer** — `auth_service.py`, `cliente_service.py`, and `intereses_service.py` encapsulate business and integration logic.
- **Dependency injection** — FastAPI `Depends(...)` is used in `app/util/dependencies.py` to build service instances and shared resources.
- **Adapter / Proxy pattern** — the backend proxies requests to an external Innovasoft API while adding audit logging and local persistence.

### Backend SOLID Principles

Several SOLID principles are explicitly applied:

- **Single Responsibility Principle**: Each route, service, repository, schema, and utility has a focused purpose.
- **Open/Closed Principle**: Business logic is encapsulated in service classes so new features can be added without changing existing route handlers.
- **Dependency Inversion Principle**: High-level route handlers depend on abstractions provided by FastAPI dependency injection, not on concrete construction logic.
- **Interface Segregation Principle**: Different route groups and service interfaces are segregated by domain (`auth`, `cliente`, `intereses`).
- **Liskov Substitution Principle**: Schemas and service contracts are designed to return consistent DTOs and response shapes across routes.

### Backend Tree

```text
backend/
  .env
  Dockerfile
  README.md
  main.py
  pyproject.toml
  requirements.txt
  compose.yaml
  app/
    api/
      authenticate.py
      cliente.py
      intereses.py
      __init__.py
    services/
      auth_service.py
      cliente_service.py
      intereses_service.py
    repository/
      base.py
      operation_repository.py
      session_repository.py
    schema/
      auth.py
      cliente.py
      intereses.py
      operation.py
      session.py
    model/
      mongo.py
      operation.py
      session.py
    util/
      dependencies.py
      http_client.py
      settings.py
```

---

## Frontend Architecture

The frontend is implemented in `frontend/` using a **feature-based architecture**.

### Feature-based organization

The application is organized around domain features instead of technical layers. Each feature directory contains its own UI components, services, hooks, and data validation schemas.

Core frontend concepts include:

- `features/` — feature modules for `auth`, `clients`, `home`, and `error_pages`.
- `shared/` — shared utilities, theme configuration, shared components, and global context.
- `router/` — contains navigation and route composition.
- `constants/` — shared route definitions and static configuration.

### Frontend Design Practices

The frontend uses these good practices:

- **Feature segmentation** — each domain owns its own page and service layer.
- **React context** — authentication state and notifications are provided through context providers.
- **Separation of concerns** — UI components, service calls, routing, and schema validation are separated.
- **Reusable shared modules** — common behavior and theme styling are centralized under `shared/`.

### Frontend Tree

```text
frontend/
  package.json
  package-lock.json
  public/
  src/
    App.js
    index.js
    constants/
      routes.js
    router/
      AppRouter.js
    features/
      auth/
        components/
        context/
        hooks/
        schemas/
        services/
        index.js
      clients/
        components/
        hooks/
        schemas/
        services/
        index.js
      home/
        components/
        index.js
      error_pages/
        components/
        index.js
    shared/
      api/
      components/
      context/
      theme/
```

---

## Recommended Usage

- Use the backend to handle secure authentication, proxy external API calls, and persist audit events to MongoDB.
- Use the frontend to render feature-specific pages, manage authentication state, and call the backend via Axios.
- Keep adding new features in the frontend as self-contained feature modules.
- Keep extending backend services and repositories without coupling route handlers to persistence details.

---

## Professional Notes

This repository demonstrates a maintainable full-stack structure with:

- explicit separation between API routes, business logic, persistence, and shared utilities in the backend,
- a feature-based React frontend that keeps domain areas isolated,
- SOLID-based design principles for better code quality,
- and design patterns such as Repository, Dependency Injection, and Adapter/Proxy integration.
