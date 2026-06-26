# Industrial Operations Suite

A full-stack manufacturing operations platform for real-time equipment monitoring, work order management, inventory tracking, shift reporting, downtime analysis, and KPI dashboards.

Built as a portfolio project targeting manufacturing and industrial tech roles.

---

## Screenshots

> Screenshots coming soon — see `/screenshots` folder after first deployment.

---

## Tech Stack

**Frontend**
- React 18 (Vite)
- React Router DOM
- Redux Toolkit
- Recharts
- Axios

**Backend**
- Java 21
- Spring Boot 3.5
- Spring Data JPA / Hibernate
- PostgreSQL
- Lombok

---

## Features

- **Dashboard** — Live KPI overview: OEE, availability, performance, quality, active alerts, and ongoing downtime events
- **Equipment** — Full equipment registry with status tracking (Operational, Under Maintenance, Offline)
- **Work Orders** — Create, assign, start, complete, and cancel maintenance work orders with priority and cost tracking
- **Inventory** — Track parts and materials with low-stock alerting
- **Downtime** — Log and categorize downtime events with root cause analysis
- **Production** — Log production runs with automatic OEE calculation (Availability × Performance × Quality)
- **Shift Reports** — Shift-level summaries with operator and technician notes
- **Alerts** — Multi-severity alert system (Info, Warning, Critical, Emergency) with acknowledgement workflow

---

## Project Structure

```
industrial-operations-suite/
├── src/                          # Spring Boot backend
│   └── main/java/com/industrialops/
│       ├── config/               # CORS, exception handling
│       ├── controller/           # REST API endpoints
│       ├── dto/                  # Data transfer objects
│       ├── model/                # JPA entities
│       ├── repository/           # Spring Data repositories
│       └── service/              # Business logic
├── frontend-react/               # React frontend (Vite)
│   └── src/
│       ├── Components/           # Shared UI components
│       ├── Pages/                # Page-level components
│       └── Services/             # Axios API client
├── database/                     # SQL seed data
├── docs/                         # Additional documentation
└── pom.xml                       # Maven build configuration
```

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 14+

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE industrial_ops;
```

2. Run the seed data:
```bash
psql -U postgres -d industrial_ops -f database/sample_data.sql
```

### Backend Setup

1. Create `src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/industrial_ops
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
app.cors.allowed-origins=http://localhost:5173
```

2. Start the backend:
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

- **Spring profiles** — Local credentials are kept in `application-local.properties` (gitignored). The public repo contains only placeholder values.
- **`FetchType.EAGER`** — All `@ManyToOne` relationships use eager loading to avoid Hibernate lazy-initialization exceptions during JSON serialization.
- **`Promise.allSettled`** — The dashboard fires all API calls simultaneously. If one fails, the rest still render.
- **OEE calculation** — Computed automatically on save via `@PrePersist`/`@PreUpdate` hooks on `ProductionLog`: `OEE = Availability × Performance × Quality`

---

## Known Issues / Roadmap

- [ ] OEE gauge color threshold not yet implemented
- [ ] `analytics-python` and `powerbi` folders are stubs for future analytics integration
- [ ] No authentication — all endpoints are currently public
- [ ] Unit tests are minimal — integration tests planned

---

## Author

## Author

Paul Sims — Computer Information Systems & Business Administration/Finance  
Colorado State University  
[GitHub](https://github.com/PSIMS226)