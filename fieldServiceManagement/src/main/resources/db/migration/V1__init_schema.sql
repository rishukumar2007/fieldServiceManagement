-- V1__init_schema.sql
-- Flyway Database Schema Migration for KEYSTONE Field Service Management Platform

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255)
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50)
);

-- 3. Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    CONSTRAINT fk_sites_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 4. Parts Inventory Table
CREATE TABLE IF NOT EXISTS parts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    unit_cost DOUBLE NOT NULL,
    stock_qty INT NOT NULL
);

-- 5. Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    sla_due_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    customer_id BIGINT NOT NULL,
    site_id BIGINT NOT NULL,
    assigned_to_id BIGINT,
    parts_cost DOUBLE DEFAULT 0.0,
    labor_minutes INT DEFAULT 0,
    CONSTRAINT fk_wo_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_wo_site FOREIGN KEY (site_id) REFERENCES sites(id),
    CONSTRAINT fk_wo_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

-- 6. Work Order Status History (Append-Only Audit Trail)
CREATE TABLE IF NOT EXISTS work_order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id BIGINT,
    changed_at TIMESTAMP NOT NULL,
    note TEXT,
    CONSTRAINT fk_wosh_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_wosh_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);

-- 7. Part Usages Table
CREATE TABLE IF NOT EXISTS part_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    unit_cost DOUBLE NOT NULL,
    qty_used INT NOT NULL,
    total_cost DOUBLE NOT NULL,
    CONSTRAINT fk_pu_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_pu_part FOREIGN KEY (part_id) REFERENCES parts(id)
);

-- 8. Time Logs Table
CREATE TABLE IF NOT EXISTS time_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    minutes INT NOT NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_tl_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_tl_tech FOREIGN KEY (technician_id) REFERENCES users(id)
);
