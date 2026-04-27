# Monorepo de Prueba Técnica

Este repositorio contiene una implementación de prueba técnica full-stack con dos proyectos principales:

- `backend/` — un backend en Python con FastAPI que usa una arquitectura en capas.
- `frontend/` — un frontend en React organizado con una arquitectura basada en características.

Ambos proyectos están construidos pensando en la mantenibilidad, la separación de responsabilidades y buenas prácticas de ingeniería.

## Arquitectura General

React JS → API Local (FastAPI)/MongoDB → API Innovasoft 

```text
React JS (frontend) -> API Local (FastAPI)/MongoDB
                         |
                         v
                 API Innovasoft
```

### Responsabilidades de la API Local

- Exponer una API REST local para el frontend React.
- Validar y transformar solicitudes con Pydantic.
- Persistir sesiones, tokens y auditoría en MongoDB.
- Reenviar llamadas necesarias a la API externa.
- Procesar respuestas externas y devolver resultados al cliente.
- Gestionar autenticación, clientes e intereses desde una capa de servicio.

---

## Arquitectura del Backend

El backend en `backend/` está estructurado como un servicio API en capas o “clean architecture”. Las capas principales son:

- `api/` — definiciones de rutas FastAPI y manejo de solicitudes HTTP.
- `services/` — lógica de negocio, orquestación e integración con APIs externas.
- `repository/` — capa de persistencia que escribe registros de auditoría y estado de sesión en MongoDB.
- `schema/` — modelos de solicitud/respuesta, DTOs y esquemas de validación.
- `model/` — abstracciones de modelos de base de datos y utilidades de MongoDB.
- `util/` — utilidades compartidas, proveedores de dependencias, configuración del cliente HTTP y settings.

### Patrones de Diseño del Backend

El backend utiliza varios patrones establecidos:

- **Arquitectura en capas** — cada capa tiene una responsabilidad clara y se comunica mediante interfaces bien definidas.
- **Patrón repositorio** — `operation_repository.py` y `session_repository.py` encapsulan operaciones de persistencia en MongoDB.
- **Capa de servicios** — `auth_service.py`, `cliente_service.py` y `intereses_service.py` encapsulan la lógica de negocio y la integración.
- **Inyección de dependencias** — FastAPI `Depends(...)` se usa en `app/util/dependencies.py` para construir instancias de servicios y recursos compartidos.
- **Patrón adaptador/proxy** — el backend actúa como proxy para las solicitudes a la API externa, agregando auditoría y persistencia local.

### Principios SOLID del Backend

Se aplican varios principios SOLID de forma explícita:

- **Principio de Responsabilidad Única**: cada ruta, servicio, repositorio, esquema y utilidad tiene un propósito enfocado.
- **Principio Abierto/Cerrado**: la lógica de negocio está encapsulada en clases de servicio para añadir nuevas funciones sin cambiar los handlers existentes.
- **Principio de Inversión de Dependencias**: los handlers de nivel alto dependen de abstracciones provistas por la inyección de dependencias de FastAPI, no de la lógica de construcción concreta.
- **Principio de Segregación de Interfaces**: diferentes grupos de rutas e interfaces de servicio están segregados por dominio (`auth`, `cliente`, `intereses`).
- **Principio de Sustitución de Liskov**: los esquemas y contratos de servicio están diseñados para devolver DTOs y formatos de respuesta consistentes.

### Estructura del Backend

```text
backend/
  main.py               # arranca FastAPI y el ciclo de vida de MongoDB
  app/
    api/                # capa HTTP, definiciones de rutas y validación de solicitudes
      authenticate.py
      cliente.py
      intereses.py
    services/           # servicios de dominio y lógica proxy para API externa
      auth_service.py
      cliente_service.py
      intereses_service.py
    repository/         # persistencia de auditoría y almacenamiento de sesiones
      operation_repository.py
      session_repository.py
    schema/             # modelos Pydantic, DTOs y esquemas de API
      auth.py
      cliente.py
      intereses.py
      operation.py
      session.py
    model/              # modelos MongoDB y helpers de bajo nivel
      mongo.py
      operation.py
      session.py
    util/               # configuración compartida, dependencia, cliente HTTP, settings
      dependencies.py
      http_client.py
      settings.py
```

Esta estructura de backend está diseñada intencionalmente en capas: `api/` maneja la coordinación HTTP, `services/` contiene la lógica de negocio e integración, `repository/` persiste el estado, `schema/` define los contratos y `util/` conecta los recursos compartidos.

---

## Arquitectura del Frontend

El frontend está implementado en `frontend/` usando una **arquitectura basada en características**.

### Organización basada en características

La aplicación se organiza alrededor de características de dominio en lugar de capas técnicas. Cada directorio de característica contiene sus propios componentes de UI, servicios, hooks y esquemas de validación de datos.

Conceptos principales del frontend:

- `features/` — módulos de característica para `auth`, `clients`, `home` y `error_pages`.
- `shared/` — utilidades compartidas, configuración de tema, componentes comunes y contexto global.
- `router/` — contiene la navegación y la composición de rutas.
- `constants/` — definiciones de rutas compartidas y configuración estática.

### Buenas prácticas del Frontend

El frontend utiliza las siguientes buenas prácticas:

- **Segmentación por característica** — cada dominio tiene su propia página y capa de servicio.
- **Contexto de React** — el estado de autenticación y las notificaciones se proporcionan mediante providers.
- **Separación de responsabilidades** — componentes UI, llamadas a servicios, enrutamiento y validación se mantienen separados.
- **Módulos compartidos reutilizables** — el comportamiento común y el estilo del tema se centralizan en `shared/`.

### Estructura del Frontend

```text
frontend/
  package.json          # dependencias y scripts de la app React
  src/
    App.js              # composición raíz de la app y providers
    index.js            # arranque de la app y montaje en React DOM
    router/             # navegación y manejo de rutas protegidas
      AppRouter.js
    features/           # módulos basados en características con páginas, servicios y hooks
      auth/             # login, registro, estado de autenticación y servicio auth
      clients/          # listado de clientes, mantenimiento e integración API
      home/             # dashboard de inicio y UI específica de la característica
      error_pages/      # componentes de página 404 y errores
    shared/             # utilidades compartidas, contexto, tema y helpers API
      api/
      components/
      context/
      theme/
```

Esta estructura de frontend sigue una arquitectura basada en características: cada dominio mantiene su propia UI, lógica de servicio y esquemas de validación, mientras que las utilidades compartidas se centralizan en `shared/`.

---

## Uso Recomendado

- Usar el backend para manejar autenticación segura, proxy de llamadas a APIs externas y persistencia de eventos de auditoría en MongoDB.
- Usar el frontend para renderizar páginas específicas de cada característica, gestionar el estado de autenticación y llamar al backend mediante Axios.
- Seguir agregando nuevas características en el frontend como módulos auto contenidos.
- Seguir extendiendo los servicios y repositorios del backend sin acoplar los manejadores de rutas a los detalles de persistencia.

## Docker Compose

Este repositorio incluye un `compose.yaml` que inicia todo el stack:

- `api` — construye el backend desde `./backend` y expone el puerto `8000`.
- `frontend` — construye la aplicación React desde `./frontend` y expone el puerto `8080`.
- `mongodb` — inicia un contenedor MongoDB y expone el puerto `27017`.

La configuración de entorno se carga desde un archivo `.env` raíz. El repositorio también incluye `example.env` como plantilla para la configuración local.

Valores de ejemplo para `.env`:

```env
PORT=8000
MONGODB_URI=mongodb://<username>:<password>@mongodb:27017
MONGODB_DB=technical_test
EXTERNAL_API_BASE_URL=https://yourapi.com/Api
MONGO_INITDB_ROOT_USERNAME=<mongo_root_username>
MONGO_INITDB_ROOT_PASSWORD=<mongo_root_password>
```

Inicia todo el stack con:

```bash
docker compose up --build
```

Ejecuta en modo desacoplado con:

```bash
docker compose up -d --build
```

Detén y elimina los contenedores con:

```bash
docker compose down
```

## Cumplimiento Técnico

Este monorepo está diseñado para cumplir los requisitos de la prueba:

- Backend construido con **Python 3.10+** usando **FastAPI**.
- Consumo de API externa mediante **httpx** en modo asíncrono.
- Persistencia de sesiones en **MongoDB** almacenando token JWT, datos de usuario autenticado, timestamp de login y limpieza de sesión al logout.
- Aplicación configurable para múltiples entornos usando **Docker** y variables de entorno.
- Configuración de entorno soportada mediante archivos `.env` y variables de entorno de contenedor para producción, staging y local.
- Validación de entrada fuerte para campos obligatorios, tipos de datos y formatos mediante esquemas Pydantic.
- Código organizado para legibilidad, mantenibilidad y buenas prácticas de arquitectura limpia.

---

## Notas Profesionales

Este repositorio demuestra una estructura full-stack mantenible con:

- separación explícita entre rutas API, lógica de negocio, persistencia y utilidades compartidas en el backend,
- un frontend React basado en características que mantiene aisladas las áreas de dominio,
- principios SOLID para mejorar la calidad del código,
- y patrones de diseño como Repositorio, Inyección de Dependencias y Adaptador/Proxy.
