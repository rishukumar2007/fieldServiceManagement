# KEYSTONE — Field Service Management Platform

> **Client**: Meridian Facilities Management  
> **Domain**: Java Full-Stack Engineering (Zidio Development Internship Project)  
> **Architecture**: Spring Boot 3 (Java 21) REST API + React 18 / TypeScript SPA (Vite) + PostgreSQL / H2  

---

## 🌟 Executive Summary

**Project KEYSTONE** is an end-to-end, enterprise-grade field service management platform designed for commercial facility maintenance operations (HVAC, electrical, plumbing). It replaces paper spreadsheets and fragmented messaging apps with a unified system of record for inbound maintenance requests, dispatching, field work updates, SLA monitoring, and customer tracking.

---

## 🏗️ System Architecture & Layering

The application follows a clean, decoupled layered architecture according to **Section 06** of the Zidio Technical Specification:

```text
keystone/
├── fieldServiceManagement/               # Spring Boot 3 (Java 21) Backend Service
│   ├── src/main/java/com/KEYSTONE/fieldServiceManagement/
│   │   ├── Config/                       # WebConfig (CORS), OpenApiConfig (Swagger), DataSeeder
│   │   ├── Controller/                   # Thin REST Controllers (HTTP validation & DTO mapping)
│   │   ├── Dto/                          # Data Transfer Objects (Auth, WorkOrder, Status, Parts, Time)
│   │   ├── Entity/                       # JPA Domain Entities (User, Customer, Site, WorkOrder, etc.)
│   │   ├── Enum/                         # Domain Enums (Role, Priority, WorkOrderStatus)
│   │   ├── Repository/                   # Spring Data JPA Data Access Interfaces
│   │   ├── Security/                     # Stateless JWT Filters & Security Configuration
│   │   └── Service/                      # Business Rules, SLA Logic & Governed State Machine
│   └── src/main/resources/
│       ├── application.properties        # Configured for H2 (instant local) & MySQL / PostgreSQL
│       └── db/migration/V1__init_schema.sql # Flyway Database Migrations
└── src/                                  # React 18 + TypeScript (Vite) Frontend SPA
    ├── components/                       # UI Components (Header, Sidebar, Dashboard, WorkOrdersPage, LoginPage)
    ├── context/                          # DataContext & Authentication State Machine
    ├── services/                         # KeystoneApiClient (Appendix B REST API Integration)
    └── types/                            # TypeScript Domain Models
```

---

## 🔄 Governed Work-Order Lifecycle (State Machine)

Work order status transitions are strictly governed by the service layer (**Section 07**). Illegal state jumps are rejected on the server with `HTTP 409 Conflict` / `IllegalStateException`. Every transition generates an **append-only audit trail** in `WorkOrderStatusHistory`.

```text
[NEW] ────► [ASSIGNED] ────► [IN_PROGRESS] ────► [COMPLETED] ────► [CLOSED (Terminal)]
  │               │                │
  │               │                ├───► [ON_HOLD] ──► [IN_PROGRESS]
  ▼               ▼                ▼
[CANCELLED]   [CANCELLED]      [CANCELLED]
```

### Transition Rules:
- `NEW -> ASSIGNED`, `NEW -> CANCELLED`
- `ASSIGNED -> IN_PROGRESS`, `ASSIGNED -> CANCELLED`
- `IN_PROGRESS -> ON_HOLD`, `IN_PROGRESS -> COMPLETED`, `IN_PROGRESS -> CANCELLED`
- `ON_HOLD -> IN_PROGRESS`, `ON_HOLD -> CANCELLED`
- `COMPLETED -> CLOSED` (Manager only)
- `CLOSED` and `CANCELLED` are terminal states.

---

## 🔑 Seed Login Credentials (PDF Section 15)

The platform comes pre-seeded with 4 reference role accounts for instant testing:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Manager** | `john.m@meridian.com` | `password123` | Full access, close jobs, manage inventory, view reports & SLA. |
| **Dispatcher** | `sarah.v@meridian.com` | `password123` | Create customers/sites/orders, assign technicians, manage board. |
| **Technician** | `mike.smith@meridian.com` | `password123` | Field view, start/hold/complete assigned jobs, log parts & labor time. |
| **Customer** | `alice@acmecorp.com` | `password123` | Self-service portal: raise requests for own sites, track status. |

---

## ⚡ Quickstart & Local Setup

### 1. Run the Spring Boot Java Backend
```bash
cd fieldServiceManagement
./mvnw spring-boot:run
```
- **Backend API**: `http://localhost:8080/api`
- **Swagger UI Documentation**: `http://localhost:8080/swagger-ui.html`
- **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:keystonedb`)

### 2. Run the React Frontend
```bash
npm install
npm run dev
```
- **Frontend SPA**: `http://localhost:3000`

---

## 📚 API Reference (PDF Appendix B)

- `POST /api/auth/login` — Authenticate and receive JWT token & role.
- `GET /api/work-orders` — List filterable & paginated work orders.
- `POST /api/work-orders` — Create a new work order.
- `GET /api/work-orders/{id}` — Fetch work order detail with audit history.
- `POST /api/work-orders/{id}/assign` — Assign a work order to a technician.
- `POST /api/work-orders/{id}/status` — Transition work order status (validated by state machine).
- `POST /api/work-orders/{id}/parts` — Transactionally log part usage & decrement stock.
- `POST /api/work-orders/{id}/time` — Log labor minutes & technician notes.
- `GET /api/reports/summary` — Fetch executive SLA compliance & status breakdown metrics.

---

## 📜 License & Acknowledgments

Issued by **Zidio Development** — Java Full-Stack Engineering Practice.  
*Client: Meridian Facilities Management*.
