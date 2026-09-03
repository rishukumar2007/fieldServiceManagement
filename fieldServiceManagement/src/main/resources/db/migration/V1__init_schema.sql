-- V1__init_schema.sql
-- Flyway Database Schema Migration for KEYSTONE Field Service Management Platform

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    sites_count INT DEFAULT 0,
    created_at TIMESTAMP
);

-- 3. Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    customer_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP,
    CONSTRAINT fk_sites_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 4. Parts Inventory Table
CREATE TABLE IF NOT EXISTS parts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    unit_cost DECIMAL(10, 2) NOT NULL,
    stock_qty INT NOT NULL
);

-- 5. Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2048),
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    sla_due_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    customer_id VARCHAR(64) NOT NULL,
    site_id VARCHAR(64) NOT NULL,
    assigned_to_id VARCHAR(64),
    parts_cost DECIMAL(12, 2) DEFAULT 0.00,
    labor_minutes INT DEFAULT 0,
    CONSTRAINT fk_wo_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_wo_site FOREIGN KEY (site_id) REFERENCES sites(id),
    CONSTRAINT fk_wo_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

-- 6. Work Order Status History (Append-Only Audit Trail)
CREATE TABLE IF NOT EXISTS work_order_status_history (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id VARCHAR(64),
    changed_at TIMESTAMP NOT NULL,
    note VARCHAR(1024),
    CONSTRAINT fk_wosh_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_wosh_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);

-- 7. Part Usages Table
CREATE TABLE IF NOT EXISTS part_usages (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) NOT NULL,
    part_id VARCHAR(64) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    qty_used INT NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,
    logged_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_pu_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_pu_part FOREIGN KEY (part_id) REFERENCES parts(id)
);

-- 8. Time Logs Table
CREATE TABLE IF NOT EXISTS time_logs (
    id VARCHAR(64) PRIMARY KEY,
    work_order_id VARCHAR(64) NOT NULL,
    technician_id VARCHAR(64),
    minutes INT NOT NULL,
    note VARCHAR(1024),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_tl_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_tl_tech FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1024) NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    is_read BOOLEAN NOT NULL,
    work_order_id VARCHAR(64)
);
