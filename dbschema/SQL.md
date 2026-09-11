# SQL Database Schema

## Supported Databases

- **MySQL 8.0+** (Recommended)
- **PostgreSQL 13+**
- **SQLite 3** (Development)
- **SQL Server 2019+**
- **MariaDB 10.5+**

## Quick Start

### MySQL

```bash
mysql -u root -p < schema.sql
```

### PostgreSQL

```bash
psql -U postgres -d scholarsync -f schema.sql
```

### SQLite

```bash
sqlite3 scholarsync.db < schema.sql
```

---

## Complete SQL Schema

```sql
-- =====================================================
-- ScholarSync SQL Database Schema
-- Compatible with MySQL, PostgreSQL, SQLite
-- =====================================================

-- Drop tables if exist (in correct order)
DROP TABLE IF EXISTS api_score_logs;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS research_data;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    hod_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('researcher', 'dept_hod', 'research_cell_admin', 'college_admin') NOT NULL DEFAULT 'researcher',
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    orcid VARCHAR(50),
    country VARCHAR(50) DEFAULT 'India',
    keywords TEXT,
    biography TEXT,
    website VARCHAR(255),
    linkedin VARCHAR(255),
    google_scholar VARCHAR(255),
    research_gate VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for department HOD
ALTER TABLE departments ADD CONSTRAINT fk_dept_hod FOREIGN KEY (hod_id) REFERENCES users(id);

-- =====================================================
-- RESEARCH DATA TABLE
-- =====================================================
CREATE TABLE research_data (
    r_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    keywords VARCHAR(500),
    r_department VARCHAR(100) NOT NULL,
    submission_date DATE NOT NULL,
    author_id INTEGER NOT NULL,
    status ENUM('Pending HOD', 'Pending Research Cell', 'Approved by College', 'Rejected') DEFAULT 'Pending HOD',
    file_path VARCHAR(255),
    
    -- Publication details
    publication_type ENUM('journal-article', 'conference-paper', 'book', 'book-chapter', 'patent', 'review', 'thesis') DEFAULT 'journal-article',
    authorship_position ENUM('first-author', 'second-author', 'co-author') DEFAULT 'first-author',
    total_authors INTEGER DEFAULT 1,
    api_score DECIMAL(10,2) DEFAULT 0,
    
    -- Journal specific
    journal_name VARCHAR(255),
    volume VARCHAR(20),
    issue VARCHAR(20),
    pages VARCHAR(50),
    doi VARCHAR(100),
    issn VARCHAR(20),
    impact_factor DECIMAL(4,2),
    publication_date DATE,
    
    -- Conference specific
    conference_name VARCHAR(255),
    conference_location VARCHAR(255),
    conference_date DATE,
    indexed_in VARCHAR(255),
    
    -- Book specific
    book_title VARCHAR(255),
    editors VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
    city VARCHAR(100),
    isbn VARCHAR(20),
    
    -- Patent specific
    patent_number VARCHAR(50),
    patent_office VARCHAR(100),
    filing_date DATE,
    grant_date DATE,
    patent_status VARCHAR(50),
    patent_url VARCHAR(255),
    
    -- Thesis specific
    university VARCHAR(255),
    supervisor VARCHAR(100),
    thesis_department VARCHAR(100),
    thesis_type ENUM('PhD', 'Masters', 'Bachelors'),
    
    -- Approval tracking
    rejection_reason TEXT,
    hod_approved_at DATETIME,
    hod_approved_by INTEGER,
    hod_comments TEXT,
    rc_approved_at DATETIME,
    rc_approved_by INTEGER,
    rc_comments TEXT,
    college_approved_at DATETIME,
    college_approved_by INTEGER,
    college_comments TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (hod_approved_by) REFERENCES users(id),
    FOREIGN KEY (rc_approved_by) REFERENCES users(id),
    FOREIGN KEY (college_approved_by) REFERENCES users(id)
);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_announcement BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- =====================================================
-- SETTINGS TABLE
-- =====================================================
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    category VARCHAR(50),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- API SCORE LOGS TABLE
-- =====================================================
CREATE TABLE api_score_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    research_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    base_score DECIMAL(10,2),
    authorship_multiplier DECIMAL(5,2),
    author_count INTEGER,
    calculation_details JSON,
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (research_id) REFERENCES research_data(r_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_research_department ON research_data(r_department);
CREATE INDEX idx_research_author ON research_data(author_id);
CREATE INDEX idx_research_status ON research_data(status);
CREATE INDEX idx_research_date ON research_data(submission_date);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_department ON messages(department);

-- =====================================================
-- VIEWS
-- =====================================================

-- View for user research statistics
CREATE VIEW v_user_research_stats AS
SELECT 
    u.id,
    u.full_name,
    u.department,
    COUNT(r.r_id) as total_research,
    SUM(CASE WHEN r.status = 'Approved by College' THEN 1 ELSE 0 END) as approved_count,
    SUM(r.api_score) as total_api_score,
    AVG(r.api_score) as avg_api_score
FROM users u
LEFT JOIN research_data r ON u.id = r.author_id
GROUP BY u.id, u.full_name, u.department;

-- View for department statistics
CREATE VIEW v_department_stats AS
SELECT 
    r_department as department,
    COUNT(*) as total_research,
    SUM(CASE WHEN status = 'Pending HOD' THEN 1 ELSE 0 END) as pending_hod,
    SUM(CASE WHEN status = 'Pending Research Cell' THEN 1 ELSE 0 END) as pending_rc,
    SUM(CASE WHEN status = 'Approved by College' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
    SUM(api_score) as total_api_score
FROM research_data
GROUP BY r_department;

-- View for recent activity
CREATE VIEW v_recent_activity AS
SELECT 
    r.r_id,
    r.title,
    r.r_department,
    r.status,
    r.submission_date,
    u.full_name as author_name,
    r.api_score
FROM research_data r
JOIN users u ON r.author_id = u.id
ORDER BY r.submission_date DESC
LIMIT 50;

-- =====================================================
-- TRIGGERS (MySQL)
-- =====================================================

DELIMITER //

-- Auto-update timestamp
CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER update_research_timestamp
BEFORE UPDATE ON research_data
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Auto-calculate API score
CREATE TRIGGER calculate_api_score_insert
BEFORE INSERT ON research_data
FOR EACH ROW
BEGIN
    SET NEW.api_score = (
        CASE NEW.publication_type
            WHEN 'journal-article' THEN 25
            WHEN 'conference-paper' THEN 15
            WHEN 'book' THEN 30
            WHEN 'book-chapter' THEN 15
            WHEN 'patent' THEN 40
            WHEN 'review' THEN 20
            WHEN 'thesis' THEN 10
            ELSE 10
        END *
        CASE NEW.authorship_position
            WHEN 'first-author' THEN 1.0
            WHEN 'second-author' THEN 0.5
            WHEN 'co-author' THEN 0.3
            ELSE 0.3
        END /
        SQRT(NEW.total_authors)
    );
END//

CREATE TRIGGER calculate_api_score_update
BEFORE UPDATE ON research_data
FOR EACH ROW
BEGIN
    IF OLD.publication_type != NEW.publication_type 
       OR OLD.authorship_position != NEW.authorship_position 
       OR OLD.total_authors != NEW.total_authors THEN
        SET NEW.api_score = (
            CASE NEW.publication_type
                WHEN 'journal-article' THEN 25
                WHEN 'conference-paper' THEN 15
                WHEN 'book' THEN 30
                WHEN 'book-chapter' THEN 15
                WHEN 'patent' THEN 40
                WHEN 'review' THEN 20
                WHEN 'thesis' THEN 10
                ELSE 10
            END *
            CASE NEW.authorship_position
                WHEN 'first-author' THEN 1.0
                WHEN 'second-author' THEN 0.5
                WHEN 'co-author' THEN 0.3
                ELSE 0.3
            END /
            SQRT(NEW.total_authors)
        );
    END IF;
END//

DELIMITER ;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Get user dashboard stats
CREATE PROCEDURE sp_get_user_dashboard(IN user_id_param INTEGER)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM research_data WHERE author_id = user_id_param) as my_research_count,
        (SELECT COUNT(*) FROM research_data WHERE author_id = user_id_param AND status = 'Approved by College') as approved_count,
        (SELECT SUM(api_score) FROM research_data WHERE author_id = user_id_param) as total_api_score,
        (SELECT COUNT(*) FROM research_data WHERE status LIKE CONCAT('%', (SELECT department FROM users WHERE id = user_id_param), '%')) as dept_research_count;
END//

-- Get pending approvals for a role
CREATE PROCEDURE sp_get_pending_approvals(IN user_role VARCHAR(50), IN user_dept VARCHAR(100))
BEGIN
    CASE user_role
        WHEN 'dept_hod' THEN
            SELECT r.*, u.full_name as author_name
            FROM research_data r
            JOIN users u ON r.author_id = u.id
            WHERE r.r_department = user_dept AND r.status = 'Pending HOD';
        WHEN 'research_cell_admin' THEN
            SELECT r.*, u.full_name as author_name
            FROM research_data r
            JOIN users u ON r.author_id = u.id
            WHERE r.status = 'Pending Research Cell';
        WHEN 'college_admin' THEN
            SELECT r.*, u.full_name as author_name
            FROM research_data r
            JOIN users u ON r.author_id = u.id
            WHERE r.status = 'Approved by College';
    END CASE;
END//

-- Generate monthly report
CREATE PROCEDURE sp_generate_monthly_report(IN report_year INTEGER, IN report_month INTEGER)
BEGIN
    SELECT 
        r_department,
        COUNT(*) as submissions,
        SUM(CASE WHEN status = 'Approved by College' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(api_score) as total_score,
        AVG(api_score) as avg_score
    FROM research_data
    WHERE YEAR(submission_date) = report_year 
      AND MONTH(submission_date) = report_month
    GROUP BY r_department;
END//

DELIMITER ;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert departments
INSERT INTO departments (name, code, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Engineering'),
('Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering'),
('Civil Engineering', 'CE', 'Department of Civil Engineering'),
('Research Cell', 'RCA', 'Central Research Cell'),
('College Administration', 'ADMIN', 'College Administrative Office');

-- Insert sample users (password: pass123)
INSERT INTO users (username, password, role, department, email, full_name) VALUES
('researcher1', 'pass123', 'researcher', 'Computer Science', 'researcher1@college.edu', 'Dr. Alice Johnson'),
('faculty2', 'pass123', 'researcher', 'Electrical Engineering', 'faculty2@college.edu', 'Prof. Bob Smith'),
('rc_admin', 'pass123', 'research_cell_admin', 'Research Cell', 'rc_admin@college.edu', 'Dr. Carol Williams'),
('hod_cs', 'pass123', 'dept_hod', 'Computer Science', 'hod_cs@college.edu', 'Dr. David Kumar'),
('hod_ee', 'pass123', 'dept_hod', 'Electrical Engineering', 'hod_ee@college.edu', 'Dr. Emma Davis'),
('college_admin', 'pass123', 'college_admin', 'College Administration', 'college_admin@college.edu', 'Dr. Frank Miller'),
('researcher3', 'pass123', 'researcher', 'Mechanical Engineering', 'researcher3@college.edu', 'Dr. Grace Lee'),
('hod_mech', 'pass123', 'dept_hod', 'Mechanical Engineering', 'hod_mech@college.edu', 'Dr. Henry Chen'),
('researcher4', 'pass123', 'researcher', 'Civil Engineering', 'researcher4@college.edu', 'Dr. Isabella Brown'),
('hod_civil', 'pass123', 'dept_hod', 'Civil Engineering', 'hod_civil@college.edu', 'Dr. James Wilson');
```

---

## PostgreSQL Specific

```sql
-- Use UUID for primary keys (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- For PostgreSQL, replace AUTOINCREMENT with:
id SERIAL PRIMARY KEY
-- or
id BIGSERIAL PRIMARY KEY
-- or for UUID:
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()

-- Replace ENUM with CHECK constraint:
role VARCHAR(50) CHECK (role IN ('researcher', 'dept_hod', 'research_cell_admin', 'college_admin'))

-- Replace DELIMITER with:
-- PostgreSQL doesn't need DELIMITER
```

---

## SQLite Specific

```sql
-- SQLite compatible syntax
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- ...
);

-- Replace ENUM with TEXT with CHECK:
role TEXT CHECK (role IN ('researcher', 'dept_hod', 'research_cell_admin', 'college_admin'))

-- Date functions are slightly different
datetime('now') -- instead of CURRENT_TIMESTAMP
```

---

## Connection Configuration

### MySQL
```javascript
{
  type: 'sql',
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'scholarsync',
  username: 'root',
  password: 'password',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```

### PostgreSQL
```javascript
{
  type: 'sql',
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'scholarsync',
  username: 'postgres',
  password: 'password',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```

### SQLite
```javascript
{
  type: 'sql',
  dialect: 'sqlite',
  storage: './scholarsync.db',
  // or ':memory:' for in-memory database
}
```
