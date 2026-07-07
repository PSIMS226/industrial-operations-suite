
See Screenshots Folder For Specific GUI photos

### Where this project fits

The Industrial Operations Suite is deliberately positioned at the base of that arc. It is the visibility-and-unification layer - the substrate that everything above it depends on. Its roadmap follows the same trajectory: from describing operations, to predicting them, to eventually recommending and orchestrating them.

---

## Capabilities

The suite is organized into eight operational domains, each representing a distinct surface of the plant that autonomous systems will eventually act on:

| Module | Purpose |
| --- | --- |
| **Dashboard** | Consolidated operational overview across equipment and production. |
| **Equipment** | Asset registry with status, maintenance scheduling, and health tracking. |
| **Work Orders** | Creation, assignment, and lifecycle tracking of maintenance and production work. |
| **Inventory** | Stock levels, part tracking, and material availability. |
| **Downtime** | Logging and classification of downtime events for root-cause visibility. |
| **Production** | Output tracking against operational targets. |
| **Alerts** | Surfacing of operational anomalies and threshold breaches. |
| **Shift Reports** | Structured shift handoffs that preserve continuity across crews. |

---

## Architecture

The suite is a full-stack application built around a clean separation between a domain-modeled backend and a responsive operational frontend.

**Backend**
- **Java 21** and **Spring Boot 3.5** exposing a documented REST API
- **JPA / Hibernate** domain entities modeling core manufacturing concepts — equipment status, maintenance windows, downtime events, work-order lifecycles
- **JPQL** queries for operational logic such as overdue-maintenance detection
- **PostgreSQL** as the persistence layer
- Profile-based local configuration with credentials externalized and excluded from version control

**Frontend**
- **React 18** with **Vite**
- Eight dedicated operational views with a cohesive industrial theme and reusable components
- A dashboard surfacing live equipment and production metrics

The REST API is organized by operational domain, giving each module a clear and independently consumable interface — the same interface an autonomous orchestration layer would later consume programmatically.

---

## Running Locally

**Prerequisites:** Java 21+, Node.js 18+, PostgreSQL

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

Local database credentials are supplied through a gitignored Spring profile rather than committed to the repository. Configure your local profile with your PostgreSQL connection details before starting the backend.

---

## Roadmap

The roadmap follows the automation arc described above:


- **Horizon — Orchestration.** An agentic layer that reads operational state and takes guarded, closed-loop action, with humans supervising exceptions.

---

## About

Built by **Paul Sims** as a portfolio project at the intersection of manufacturing operations and modern software engineering. The suite reflects a specific conviction: that the next decade of industrial automation will be won in the operational data and decision layer, and that the systems worth building today are the ones that make that layer legible.

**Repository:** [github.com/PSIMS226/industrial-operations-suite](https://github.com/PSIMS226/industrial-operations-suite)
## Tech Stack

- React 18, Vite, Redux Toolkit, Recharts, Axios
- Java 21, Spring Boot 3.5, Spring Data JPA, PostgreSQL, Lombok

---

## Features

- **Dashboard** - Live KPI overview: OEE, availability, performance, quality, active alerts, and ongoing downtime
- **Equipment** - Full equipment registry with status tracking (Operational, Under Maintenance, Offline)
- **Work Orders** - Create, assign, start, complete, and cancel maintenance work orders with priority and cost tracking
- **Inventory** - Track parts and materials with low-stock alerting
- **Downtime** - Log and categorize downtime events with root cause analysis
- **Production** - Log production runs with automatic OEE calculation (Availability x Performance x Quality)
- **Shift Reports** - Shift-level summaries with operator and technician notes
- **Alerts** - Multi-severity alert system (Info, Warning, Critical, Emergency) with acknowledgement workflow

---

## Who Is This For

This platform was built with non-technical users in mind. A floor supervisor, shift operator, or plant manager can log equipment issues, track work orders, and view production KPIs without needing to contact IT. The interface uses plain language, color-coded statuses, and straightforward navigation so that anyone on the shop floor can use it from day one - no training required.

This directly reduces the need for an on-site IT Support Analyst in manufacturing, mining, and production environments by putting operational visibility in the hands of the people who need it most.

---

## Project Structure

```
industrial-operations-suite/
- src/                         # Spring Boot backend
  - config/                    # CORS, exception handling
  - controller/                # REST API endpoints
  - dto/                       # Data transfer objects
  - model/                     # JPA entities
  - repository/                # Spring Data repositories
  - service/                   # Business logic
- frontend-react/              # React frontend (Vite)
  - Components/                # Shared UI components
  - Pages/                     # Page-level components
  - Services/                  # Axios API client
- database/                    # SQL seed data
- docs/                        # Additional documentation
- pom.xml                      # Maven build configuration
```

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 14+

### Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE industrial_ops;
```

Run the seed data:

```bash
psql -U postgres -d industrial_ops -f database/sample_data.sql
```

### Backend Setup

Create `src/main/resources/application-local.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/industrial_ops
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
app.cors.allowed-origins=http://localhost:5173
```

Start the backend:

```bash
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend-react
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Resource | Endpoint | Methods |
|---|---|---|
| Equipment | `/api/equipment` | GET, POST, PUT |
| Work Orders | `/api/workorders` | GET, POST, PUT |
| Inventory | `/api/inventory` | GET, POST, PUT |
| Alerts | `/api/alerts` | GET, POST, PUT |
| Downtime | `/api/downtime` | GET, POST, PUT |
| Production | `/api/production` | GET, POST |
| Production KPIs | `/api/production/kpis` | GET |
| Shift Reports | `/api/shiftreports` | GET, POST |

---

## Key Design Decisions

- **Spring profiles** - Local credentials are kept in `application-local.properties` (gitignored). The public repo contains only placeholder values.
- **Eager loading** - All relationships use eager loading to avoid serialization issues during API responses.
- **Promise.allSettled** - The dashboard fires all API calls simultaneously. If one fails, the rest still render.
- **OEE calculation** - Computed automatically on save via `@PrePersist`/`@PreUpdate` hooks: `OEE = Availability x Performance x Quality`

---

## Known Issues / Roadmap

- [ ] OEE gauge color threshold styling in progress
- [ ] Analytics-python and PowerBI folders are stubs for future integration
- [ ] No authentication - all endpoints are currently public
- [ ] Unit tests are minimal - integration tests planned

---

## Author

Paul Sims - Computer Information Systems & Business Administration/Finance
Colorado State University
[GitHub](https://github.com/PSIMS226)
