# Industrial Operations Suite

A manufacturing operations platform for equipment monitoring, work order management, inventory tracking, shift reporting, downtime analysis, and KPI dashboards.

This suite is designed to be used by floor supervisors, operators, and managers with no technical background. Proper implementation of this program can elimiante the need for an IT employee.

Built as a portfolio project targeting manufacturing and industrial tech roles.

---

## Screenshots

> See `/screenshots` folder.

---

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
