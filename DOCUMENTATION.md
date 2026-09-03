# Project KEYSTONE — Technical Documentation & Architecture Report

> **Platform**: Enterprise Field Service Management & SLA Resolution Platform  
> **Client**: Meridian Facilities Management  
> **Internship Track**: Java Full-Stack Engineering (Zidio Development)  
> **Authors**: Project Keystone Team  
> **Version**: 2.4.0 (Production / Vercel Ready)  
> **Repository**: [https://github.com/rishukumar2007/fieldServiceManagement.git](https://github.com/rishukumar2007/fieldServiceManagement.git)

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Technology Stack Matrix](#2-technology-stack-matrix)
3. [System Architecture & Decoupled Design](#3-system-architecture--decoupled-design)
4. [Database Design & Schema Specification](#4-database-design--schema-specification)
5. [Authentication & Security Architecture](#5-authentication--security-architecture)
6. [Governed Work-Order State Machine](#6-governed-work-order-state-machine)
7. [Service Layer & Business Rules](#7-service-layer--business-rules)
8. [REST API Specification (Appendix B)](#8-rest-api-specification-appendix-b)
9. [Frontend SPA Architecture & UI System](#9-frontend-spa-architecture--ui-system)
10. [Deployment & Hosting Guide (Vercel + Backend)](#10-deployment--hosting-guide-vercel--backend)
11. [Verification & Submission Checklist](#11-verification--submission-checklist)

---

## 1. Executive Summary & Problem Statement

Commercial facility operations (HVAC, electrical, plumbing, emergency generators) historically suffer from fragmented dispatching, paper spreadsheets, unmonitored SLA breaches, and untracked inventory costs.

**Project KEYSTONE** provides a unified, real-time, governed digital operational backbone that:
- **Streamlines Dispatching**: Matches work orders with certified technicians based on priority and availability.
- **Enforces SLAs**: Calculates strict resolution windows (Urgent: 4h, High: 24h, Medium: 48h, Low: 72h) with automated breach alerts.
- **Audit-Controlled State Machine**: Prevents illegal transitions and creates an immutable audit trail for every status change.
- **Tracks Financial Costs**: Real-time part inventory deduction and labor logging calculated dynamically per work order.
- **Role-Based Isolation**: 4 distinct roles (Manager, Dispatcher, Technician, Customer Client) with strict permission barriers.

---

## 2. Technology Stack Matrix

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | 3.2.3 | REST API services, IoC container, transactional services |
| **Java Runtime** | OpenJDK | 21 (LTS) | Modern Java language features, virtual threads ready |
| **Security Engine** | Spring Security + JJWT | 0.12.6 | Stateless JWT authorization, BCrypt hashing, OAuth SSO |
| **ORM / Data Access** | Spring Data JPA / Hibernate | 6.4.4 | Object-relational mapping, custom repository queries |
| **Database Migration** | Flyway Community | 9.22.3 | Automated, version-controlled relational schema migrations |
| **Default Database** | H2 In-Memory | 2.2.224 | Zero-setup development & automated integration testing |
| **Production Database** | MySQL / PostgreSQL | 8.0+ / 15+ | Enterprise persistence support via `application.properties` |
| **API Documentation** | SpringDoc OpenAPI | 2.3.0 | Interactive Swagger UI v3 (`/swagger-ui.html`) |
| **Frontend Framework** | React + TypeScript | 18.3.1 | Type-safe declarative Single Page Application (SPA) |
| **Build Tool** | Vite | 8.2.1 | Fast HMR development server and optimized rollup production bundling |
| **Styling & Design System** | TailwindCSS + Vanilla CSS | 3.4.1 | Custom enterprise slate-navy design system, micro-animations |
| **Icons & Visuals** | Lucide React | 0.344.0 | Accessible SVG iconography |
| **Cloud Hosting** | Vercel | Production | Global CDN, SPA edge rewrites (`vercel.json`) |

---

## 3. System Architecture & Decoupled Design

The application follows a clean, decoupled layered architecture according to **Section 06** of the Zidio Technical Specification:

```text
keystone-root/
├── fieldServiceManagement/               # Spring Boot 3 (Java 21) Backend Service
│   ├── src/main/java/com/KEYSTONE/fieldServiceManagement/
│   │   ├── config/                       # WebConfig (CORS), OpenApiConfig (Swagger), DataInitializer
│   │   ├── controller/                   # REST Controllers (Auth, WorkOrder, Customer, Site, Part, Report)
│   │   ├── dto/                          # 19 DTOs (Requests, Responses, Summaries, Dtos)
│   │   ├── exception/                    # GlobalExceptionHandler, Custom Domain Exceptions
│   │   ├── model/                        # JPA Entities (User, Customer, Site, WorkOrder, Part, TimeLog, etc.)
│   │   │   └── Role, Priority, WorkOrderStatus  # Domain Enums
│   │   ├── repository/                   # 9 Spring Data JPA Repository Interfaces
│   │   ├── security/                     # SecurityConfig, JwtUtils, JwtAuthenticationFilter, UserDetails
│   │   └── service/                      # Transactional Business Services & Governed State Engine
│   └── src/main/resources/
│       ├── application.properties        # Clean Flyway + JPA + JWT Configuration
│       └── db/migration/V1__init_schema.sql # Version 1 Flyway DDL Script & Performance Indexes
├── src/                                  # React 18 + TypeScript (Vite) Frontend SPA
│   ├── components/                       # Modular UI Components (Header, Sidebar, Dashboard, WorkOrders, Login)
│   ├── context/                          # DataContext (State Machine, Persistent LocalStorage, Toast Engine)
│   ├── services/                         # KeystoneApiClient (REST API Bridge Client)
│   └── types/                            # Domain TypeScript Interfaces
├── vercel.json                           # Vercel Single-Page Application Client-Side Rewrite Config
├── package.json                          # Vite + React build scripts & dependencies
└── pom.xml                               # Maven Project Object Model with JJWT 0.12.6
```

---

## 4. Database Design & Schema Specification

The relational schema is managed by **Flyway** in `V1__init_schema.sql` and includes 9 tables, foreign key constraints, and 8 query performance indexes:

### 📊 Relational Tables:

1. **`users`**: System credentials, avatars, and role access.
   - `id` (VARCHAR 64 PK), `name`, `email` (UNIQUE), `password` (BCrypt), `role`, `avatar_url`, `created_at`.
2. **`customers`**: Commercial clients and corporate facilities.
   - `id` (VARCHAR 64 PK), `name`, `contact_email`, `contact_phone`, `sites_count`, `created_at`.
3. **`sites`**: Physical locations and buildings tied to customers.
   - `id` (VARCHAR 64 PK), `name`, `address`, `customer_id` (FK -> `customers.id` ON DELETE CASCADE), `created_at`.
4. **`parts`**: Spare parts inventory catalog.
   - `id` (VARCHAR 64 PK), `name`, `sku` (UNIQUE), `unit_cost` (DECIMAL 10,2), `stock_qty` (INT).
5. **`work_orders`**: Primary job entity tracking SLAs, technicians, and status.
   - `id` (VARCHAR 64 PK), `code` (UNIQUE), `title`, `description`, `priority`, `status`, `sla_due_at`, `created_at`, `customer_id` (FK), `site_id` (FK), `assigned_to_id` (FK -> `users.id`), `parts_cost`, `labor_minutes`.
6. **`work_order_status_history`**: Immutable audit log of all transitions.
   - `id` (VARCHAR 64 PK), `work_order_id` (FK), `from_status`, `to_status`, `changed_by_user_id` (FK), `changed_at`, `note`.
7. **`part_usages`**: Parts consumption entries per work order.
   - `id` (VARCHAR 64 PK), `work_order_id` (FK), `part_id` (FK), `part_name`, `unit_cost`, `qty_used`, `total_cost`, `logged_at`.
8. **`time_logs`**: Labor logs recorded by technicians.
   - `id` (VARCHAR 64 PK), `work_order_id` (FK), `technician_id` (FK), `minutes`, `note`, `created_at`.
9. **`notifications`**: System alerts for SLA breaches, assignments, and inventory.
   - `id` (VARCHAR 64 PK), `title`, `message`, `type`, `timestamp`, `is_read`, `work_order_id`.

### ⚡ Query Performance Indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_priority ON work_orders(priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_customer ON work_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned ON work_orders(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_wosh_wo_id ON work_order_status_history(work_order_id);
CREATE INDEX IF NOT EXISTS idx_part_usages_wo_id ON part_usages(work_order_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_wo_id ON time_logs(work_order_id);
```

---

## 5. Authentication & Security Architecture

### A. Stateless JWT Engine
- **Token Format**: HS256-signed JSON Web Tokens containing `sub` (email), `role`, `userId`, `name`, and expiration claims.
- **Filter**: `JwtAuthenticationFilter` intercepts incoming requests, verifies signatures using `JwtUtils`, loads user authorities, and binds them to `SecurityContextHolder`.
- **Public Endpoints**: `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`, `/h2-console/**`.
- **Protected Endpoints**: All `/api/work-orders/**`, `/api/customers/**`, `/api/reports/**` require valid Bearer token.

### B. Direct 1-Click OAuth SSO
- **Continue with Google**: Direct 1-click single sign-on generating an authenticated Google session and loading the user's role context.
- **Continue with GitHub**: Direct 1-click developer single sign-on connecting to GitHub's identity provider.
- **Standard Email Login**: Blank form allowing direct login with corporate email or personal Gmail.

---

## 6. Governed Work-Order State Machine

Transitions are strictly validated according to the state machine defined in **Section 07**:

```text
       ┌───────────────┐
       │      NEW      │
       └───────┬───────┘
               │ Assign Technician
               ▼
       ┌───────────────┐
       │   ASSIGNED    │
       └───────┬───────┘
               │ Start Job
               ▼
       ┌───────────────┐     Hold Job     ┌───────────────┐
       │  IN_PROGRESS  │ ───────────────► │    ON_HOLD    │
       └───────┬───────┘ ◄─────────────── └───────────────┘
               │               Resume Job
               ▼ Complete Work
       ┌───────────────┐
       │   COMPLETED   │
       └───────┬───────┘
               │ Manager Close-Out
               ▼
       ┌───────────────┐
       │    CLOSED     │ (Terminal)
       └───────────────┘
```

- **Cancellation**: A job can transition to `CANCELLED` from `NEW`, `ASSIGNED`, `IN_PROGRESS`, or `ON_HOLD`.
- **Terminal States**: `CLOSED` and `CANCELLED` are terminal and cannot be reopened.
- **Append-Only Auditing**: Every status change writes a new immutable record into `WorkOrderStatusHistory` with author and timestamp.

---

## 7. Service Layer & Business Rules

1. **SLA Due Date Calculation**:
   - `URGENT` priority -> SLA Due = Creation Time + **4 hours**
   - `HIGH` priority -> SLA Due = Creation Time + **24 hours**
   - `MEDIUM` priority -> SLA Due = Creation Time + **48 hours**
   - `LOW` priority -> SLA Due = Creation Time + **72 hours**
2. **Transactional Parts Inventory Check**:
   - When logging part usage, `PartService` verifies available quantity (`stock_qty >= qty_used`).
   - Atomically decrements `parts.stock_qty` and increments `work_orders.parts_cost` by `(unit_cost * qty_used)`.
   - Throws `InsufficientStockException` if stock is exhausted.
3. **Labor Tracking**:
   - `TimeLog` entries update `work_orders.labor_minutes` in real-time.

---

## 8. REST API Specification (Appendix B)

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Standard email/password JWT login |
| `POST` | `/api/auth/oauth` | Public | Direct Google / GitHub OAuth SSO login |
| `GET` | `/api/work-orders` | Authenticated | List all work orders (filterable by status/priority) |
| `GET` | `/api/work-orders/{id}` | Authenticated | Get full details, parts, time logs & status history |
| `POST` | `/api/work-orders` | Manager, Dispatcher, Customer | Create a new work order and calculate SLA |
| `PUT` | `/api/work-orders/{id}/assign` | Manager, Dispatcher | Assign technician to work order (`NEW` -> `ASSIGNED`) |
| `PUT` | `/api/work-orders/{id}/status` | Role Governed | Transition state machine status with notes |
| `POST` | `/api/work-orders/{id}/parts` | Manager, Technician | Log spare parts usage & decrement inventory |
| `POST` | `/api/work-orders/{id}/time` | Manager, Technician | Log technician labor minutes |
| `GET` | `/api/reports/summary` | Manager, Dispatcher | Dashboard metrics, open jobs, SLA compliance % |
| `GET` | `/api/reports/technicians`| Manager | Technician completed jobs and total labor minutes |

---

## 9. Frontend SPA Architecture & UI System

- **Clean SPA Routing**: Client-side single page navigation via React state with Vercel edge rewrite fallback (`vercel.json`).
- **Responsive Navigation**: Sidebar navigation with role badge display, quick search, notification drawer, and clean Sign Out.
- **Micro-Interactions**: Instant feedback toasts, dynamic status badges, hover animations, and SLA breach highlights.
- **Seed Profiles for Testing**:
  - `john.m@meridian.com` (Manager)
  - `sarah.v@meridian.com` (Dispatcher)
  - `mike.smith@meridian.com` (Technician)
  - `alice@acmecorp.com` (Customer Client)
  - Direct 1-click Google / GitHub SSO

---

## 10. Deployment & Hosting Guide (Vercel + Backend)

### A. Vercel Frontend Deployment (1-Click)
1. Push all code to GitHub: `git push origin main`.
2. In **[Vercel Dashboard](https://vercel.com/new)**, import `https://github.com/rishukumar2007/fieldServiceManagement.git`.
3. Select **Vite** preset, Output directory `dist`.
4. Click **Deploy**. Vercel will build and serve your app globally in < 60 seconds with full routing support via `vercel.json`.

### B. Spring Boot Backend Deployment (Local or Cloud)
```bash
cd fieldServiceManagement
./mvnw clean spring-boot:run
```
- Server: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

---

## 11. Verification & Submission Checklist

- [x] Spring Boot backend builds with `0 errors` (`mvn test-compile` -> BUILD SUCCESS).
- [x] React frontend builds with `0 errors` (`npm run build` -> built in 751ms).
- [x] Flyway V1 migration script verified with 9 tables and performance indexes.
- [x] BCrypt password hashing active for all user passwords.
- [x] Stateless JWT authentication filter verified with live REST curl tests.
- [x] Governed 7-step state machine enforced with immutable audit logging.
- [x] Dynamic SLA window calculation (4h, 24h, 48h, 72h) and breach indicators active.
- [x] Direct 1-click Google and GitHub OAuth SSO active without modals.
- [x] Clean SPA client-side routing configured for Vercel in `vercel.json`.
- [x] All commits pushed to GitHub repository (`57d0157`).
