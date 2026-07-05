
See Screenshots Folder For Specific GUI photos

> Machines on the factory floor are already automated. *Operations* are not. The distance between a plant full of automated equipment and a genuinely automated operation is not measured in robots or PLCs — it is measured in the decisions that still run on human judgment, tribal knowledge, and spreadsheets. This project is built for that gap.


## Overview


The **Industrial Operations Suite** consolidates that operational picture into a single system. It brings equipment health, work orders, inventory, downtime, production output, alerting, and shift handoffs under one data model and one interface — the connective tissue that a plant needs before any higher-order automation is even possible.

It is deliberately built as a *platform*, not a dashboard. The goal is not only to show operators what is happening today, but to establish the structured, queryable operational substrate on which prediction, recommendation, and eventually autonomous orchestration can be built.

---

##Can Industrial Operations Be Fully Automated Within Ten Years?

This project is grounded in a specific view of where industrial operations are heading. That view is worth stating plainly, because it explains why the suite is designed the way it is.

### The control layer is largely solved. The decision layer is the frontier.

Industrial automation is often pictured as a single problem, but it is really two. The first is the *control* problem — making a machine execute a physical task consistently. This is mature. Closed-loop control, PLCs, servo systems, and SCADA have automated the physical layer of manufacturing for a generation. A modern machining cell will hold tolerance for thousands of cycles with no human touching it.

The second is the *operations* problem — deciding what those machines should do, in what order, with what materials, and what to do when something goes wrong. This layer is still overwhelmingly human. A scheduler decides which job runs next. A supervisor decides which breakdown gets the technician first. A planner decides when to reorder stock. These decisions depend on context that lives in people's heads and in systems that do not talk to each other.

The automation story of the next decade is not primarily a story about better robots. It is a story about automating the decision and orchestration layer — and that happens in software, not hardware.

### The path runs through data, not machinery

You cannot automate a decision you cannot see. The precondition for autonomous operations is a unified, real-time, machine-readable model of the operation — sometimes called a *digital thread* or *unified namespace*. Before a system can decide what to fix first, the states of every asset, work order, and inventory item must exist in one queryable place with consistent meaning.

This is the unglamorous barrier that most "factory of the future" narratives skip past. The hard part is rarely the intelligence; it is the integration debt, the inconsistent data, and the decades of heterogeneous equipment that were never designed to be observed. This suite exists first and foremost to solve that layer — to make the operation legible to software.

### A realistic ten-year arc

Rather than a single leap to "lights-out," full automation of operations is likely to arrive in phases:

**Years 1–3 — Visibility and unification.** Operations become fully instrumented and consolidated. Every asset, order, and material has a live digital representation in a shared model. Humans still make every decision, but for the first time they make them from a single source of truth. *This is the layer the suite implements today.*

**Years 3–6 — Prediction and recommendation.** With clean operational data in place, systems shift from describing the present to anticipating the future. Predictive maintenance flags failures before they happen; demand signals drive replenishment; scheduling engines propose optimized sequences. The system recommends; humans approve. The role of the operator begins shifting from *decision-maker* to *decision-reviewer*.

**Years 6–10 — Closed-loop autonomy for routine operations.** The recommendation loop closes. Agentic systems — increasingly powered by large language models capable of reading operational state, reasoning over it, and taking action — orchestrate routine work within defined guardrails: reordering the maintenance queue, releasing work orders, adjusting inventory triggers, escalating anomalies. Humans move up the stack again, from reviewing individual decisions to supervising an autonomous system and handling the exceptions it cannot.

### Why "fully" is the wrong word — and where the friction lives

Ten years is enough to automate the *routine* operation. It is not enough to make the entire industrial base human-free, and honest analysis has to say so. Several frictions are structural, not technical:

- **Brownfield reality.** The average plant is not a greenfield showcase; it is decades of accumulated, heterogeneous equipment. Retrofitting observability and control across that installed base is slow and capital-intensive.
- **Integration debt.** The barrier to autonomy is usually not the algorithm but the fact that the MES, ERP, and machine data do not share a language. This is precisely the problem worth solving first.
- **The last-10% problem.** Physical manipulation of non-repetitive tasks, unstructured troubleshooting, and true edge cases remain genuinely hard. Automation handles the common case long before it handles the rare one.
- **Trust, safety, and liability.** Autonomy in a physical, high-consequence environment raises real questions about accountability when a system decides wrongly. Adoption will be gated by trust as much as by capability.
- **The sociotechnical barrier.** The organizational change — retraining, restructuring roles, rebuilding institutional trust in the system — is frequently larger than the engineering challenge.

The realistic conclusion: within ten years, the *routine* operation of a well-instrumented plant can plausibly become autonomous, with humans supervising rather than executing. "Full" automation across the entire industrial economy will be uneven — leading-edge facilities operating near-autonomously while a long tail of legacy operations lags by years. The winners will not be those with the most advanced robots. They will be those who unified their operational data early enough to build on it.

### Where this project fits

The Industrial Operations Suite is deliberately positioned at the base of that arc. It is the visibility-and-unification layer — the substrate that everything above it depends on. Its roadmap follows the same trajectory: from describing operations, to predicting them, to eventually recommending and orchestrating them.

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
