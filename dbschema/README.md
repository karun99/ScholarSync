# ScholarSync Database Schema Documentation

This document provides comprehensive documentation for all database configurations supported by ScholarSync.

## Supported Database Types

1. **localStorage** (Default) - Browser-based local storage
2. **SQL Databases** - MySQL, PostgreSQL, SQLite, SQL Server
3. **Cloud Services** - Firebase Realtime Database & Firestore

---

## Table of Contents

1. [localStorage Schema](#localstorage-schema)
2. [SQL Schema](#sql-schema)
3. [Firebase Schema](#firebase-schema)
4. [Data Import/Export](#data-importexport)
5. [Migration Guide](#migration-guide)

---

## localStorage Schema

### Overview
localStorage is the default database option, requiring no additional setup. Data is stored as JSON in the browser's localStorage.

### Storage Keys

| Key | Description | Data Type |
|-----|-------------|-----------|
| `scholarsync_users` | User accounts and credentials | Array |
| `scholarsync_rdata` | Research submissions | Array |
| `scholarsync_messages` | Announcements and messages | Array |
| `scholarsync_settings` | Application settings | Object |
| `scholarsync_auth` | Current authenticated session | Object |
| `scholarsync_profile_{id}` | User profile data | Object |

### Schema Definitions

#### Users Schema
```json
{
  "id": "number (primary key)",
  "username": "string (unique)",
  "password": "string (hashed in production)",
  "role": "enum: researcher | dept_hod | research_cell_admin | college_admin",
  "department": "string",
  "email": "string",
  "fullName": "string (optional)",
  "orcid": "string (optional)",
  "country": "string (default: 'India')",
  "keywords": "string (optional)",
  "biography": "string (optional)",
  "website": "string (optional)",
  "linkedIn": "string (optional)",
  "googleScholar": "string (optional)",
  "researchGate": "string (optional)"
}
```

#### Research Data Schema
```json
{
  "r_id": "number (primary key)",
  "title": "string",
  "abstract": "string",
  "keywords": "string",
  "r_department": "string",
  "submission_date": "ISO date string",
  "author_id": "number (foreign key to users.id)",
  "status": "enum: Pending HOD | Pending Research Cell | Approved by College | Rejected",
  "file_path": "string | null",
  "publicationType": "enum: journal-article | conference-paper | book | book-chapter | patent | review | thesis",
  "authorshipPosition": "enum: first-author | second-author | co-author",
  "totalAuthors": "number",
  "apiScore": "number (calculated)"
}
```

#### Messages Schema
```json
{
  "id": "number (primary key)",
  "senderId": "number (foreign key to users.id)",
  "senderName": "string",
  "senderRole": "string",
  "content": "string",
  "timestamp": "ISO datetime string",
  "isAnnouncement": "boolean",
  "department": "string"
}
```

#### Settings Schema
```json
{
  "institutionName": "string",
  "institutionTagline": "string",
  "logoUrl": "string",
  "primaryColor": "string (hex color)",
  "accentColor": "string (hex color)",
  "contactEmail": "string",
  "contactPhone": "string",
  "address": "string",
  "website": "string",
  "welcomeMessage": "string",
  "announcementBanner": "string",
  "enableAnnouncementBanner": "boolean",
  "maintenanceMode": "boolean",
  "maintenanceMessage": "string",
  "database": {
    "type": "enum: local | sql | cloud",
    "local": { "enabled": "boolean" },
    "sql": { ... },
    "cloud": { ... }
  },
  "aboutContent": { ... },
  "appendixContent": { ... }
}
```

### Limitations

- Storage limit: ~5-10 MB (browser dependent)
- No concurrent access (single user)
- Data tied to specific browser/device
- No server-side processing
- Not suitable for production with multiple users

---

## SQL Schema

### Database Support

| Database | Tested | Notes |
|----------|--------|-------|
| MySQL 8.0+ | Yes | Recommended for production |
| PostgreSQL 13+ | Yes | Excellent for complex queries |
| SQLite 3 | Yes | Good for small deployments |
| SQL Server 2019+ | Partial | May need minor adjustments |
| MariaDB | Yes | MySQL compatible |

### Database Creation

```sql
-- Create database
CREATE DATABASE scholarsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scholarsync;
```

### Tables

#### users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('researcher', 'dept_hod', 'research_cell_admin', 'college_admin') NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_role (role)
);
```

#### research_data
```sql
CREATE TABLE research_data (
    r_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    keywords VARCHAR(500),
    r_department VARCHAR(100) NOT NULL,
    submission_date DATE NOT NULL,
    author_id INT NOT NULL,
    status ENUM('Pending HOD', 'Pending Research Cell', 'Approved by College', 'Rejected') DEFAULT 'Pending HOD',
    file_path VARCHAR(255),
    publication_type ENUM('journal-article', 'conference-paper', 'book', 'book-chapter', 'patent', 'review', 'thesis') DEFAULT 'journal-article',
    authorship_position ENUM('first-author', 'second-author', 'co-author') DEFAULT 'first-author',
    total_authors INT DEFAULT 1,
    api_score DECIMAL(10,2) DEFAULT 0,
    -- Journal/Conference specific
    journal_name VARCHAR(255),
    volume VARCHAR(20),
    issue VARCHAR(20),
    pages VARCHAR(50),
    doi VARCHAR(100),
    impact_factor DECIMAL(4,2),
    -- Conference specific
    conference_name VARCHAR(255),
    conference_location VARCHAR(255),
    conference_date DATE,
    isbn VARCHAR(20),
    indexed_in VARCHAR(255),
    -- Book specific
    book_title VARCHAR(255),
    editors VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
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
    department VARCHAR(100),
    thesis_type ENUM('PhD', 'Masters', 'Bachelors'),
    -- Metadata
    rejection_reason TEXT,
    hod_approved_at TIMESTAMP NULL,
    hod_approved_by INT,
    rc_approved_at TIMESTAMP NULL,
    rc_approved_by INT,
    college_approved_at TIMESTAMP NULL,
    college_approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (hod_approved_by) REFERENCES users(id),
    FOREIGN KEY (rc_approved_by) REFERENCES users(id),
    FOREIGN KEY (college_approved_by) REFERENCES users(id),
    INDEX idx_department (r_department),
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_submission_date (submission_date),
    FULLTEXT idx_search (title, abstract, keywords)
);
```

#### messages
```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_announcement BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_department (department)
);
```

#### settings
```sql
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### departments
```sql
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    hod_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES users(id)
);
```

#### api_score_logs
```sql
CREATE TABLE api_score_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    research_id INT NOT NULL,
    user_id INT NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    calculation_details JSON,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (research_id) REFERENCES research_data(r_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_score (user_id, score)
);
```

### Triggers (Optional)

```sql
-- Auto-calculate API score on insert/update
DELIMITER //
CREATE TRIGGER before_research_insert
BEFORE INSERT ON research_data
FOR EACH ROW
BEGIN
    SET NEW.api_score = calculate_api_score(
        NEW.publication_type,
        NEW.authorship_position,
        NEW.total_authors
    );
END //

CREATE TRIGGER before_research_update
BEFORE UPDATE ON research_data
FOR EACH ROW
BEGIN
    SET NEW.api_score = calculate_api_score(
        NEW.publication_type,
        NEW.authorship_position,
        NEW.total_authors
    );
END //
DELIMITER ;
```

### Stored Procedure for API Score

```sql
DELIMITER //
CREATE FUNCTION calculate_api_score(
    p_pub_type VARCHAR(50),
    p_auth_position VARCHAR(50),
    p_total_authors INT
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE base_score DECIMAL(10,2);
    DECLARE multiplier DECIMAL(10,2);
    
    -- Base scores by publication type
    SET base_score = CASE p_pub_type
        WHEN 'journal-article' THEN 25
        WHEN 'conference-paper' THEN 15
        WHEN 'book' THEN 30
        WHEN 'book-chapter' THEN 15
        WHEN 'patent' THEN 40
        WHEN 'review' THEN 20
        WHEN 'thesis' THEN 10
        ELSE 10
    END;
    
    -- Authorship multipliers
    SET multiplier = CASE p_auth_position
        WHEN 'first-author' THEN 1.0
        WHEN 'second-author' THEN 0.5
        WHEN 'co-author' THEN 0.3
        ELSE 0.3
    END;
    
    -- Calculate final score
    RETURN ROUND((base_score * multiplier / SQRT(p_total_authors)), 2);
END //
DELIMITER ;
```

---

## Firebase Schema

### Firebase Console Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add Firebase config to app settings

### Firestore Collections

#### users
```
/users/{userId}
{
  username: string,
  role: string,
  department: string,
  email: string,
  fullName: string,
  orcid: string,
  country: string,
  keywords: string,
  biography: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### research_data
```
/research_data/{researchId}
{
  title: string,
  abstract: string,
  keywords: string,
  r_department: string,
  submission_date: timestamp,
  author_id: string,
  author_name: string,
  status: string,
  publicationType: string,
  authorshipPosition: string,
  totalAuthors: number,
  apiScore: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### messages
```
/messages/{messageId}
{
  senderId: string,
  senderName: string,
  senderRole: string,
  content: string,
  timestamp: timestamp,
  isAnnouncement: boolean,
  department: string
}
```

#### settings
```
/settings/{settingId}
{
  institutionName: string,
  institutionTagline: string,
  primaryColor: string,
  aboutContent: object,
  appendixContent: object
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'college_admin';
    }
    
    // Research data
    match /research_data/{researchId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                   (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['dept_hod', 'research_cell_admin', 'college_admin'] ||
                    resource.data.author_id == request.auth.uid);
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                   resource.data.senderId == request.auth.uid ||
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'college_admin';
    }
  }
}
```

### Firebase Realtime Database Structure

```json
{
  "users": {
    "$userId": {
      "username": "string",
      "role": "string",
      "department": "string",
      "email": "string"
    }
  },
  "research_data": {
    "$researchId": {
      "title": "string",
      "status": "string",
      "author_id": "string"
    }
  },
  "messages": {
    "$messageId": {
      "content": "string",
      "timestamp": "number"
    }
  }
}
```

---

## Data Import/Export

### JSON Export Format

```json
{
  "version": "1.0.0",
  "exportDate": "2024-04-15T00:00:00.000Z",
  "data": {
    "users": [...],
    "researchData": [...],
    "messages": [...]
  }
}
```

### CSV Export Format

Individual CSV files for each data type:
- `users.csv` - User data
- `research_data.csv` - Research submissions
- `messages.csv` - Announcements

### Import Instructions

#### localStorage
1. Navigate to Profile page
2. Click "Import Data"
3. Select JSON file
4. Confirm import

#### SQL
1. Use provided SQL scripts
2. Import CSV files using `LOAD DATA INFILE`
3. Verify data integrity

---

## Migration Guide

### localStorage to SQL

1. Export data from localStorage as JSON
2. Run SQL schema creation script
3. Parse JSON and insert into SQL tables
4. Update app settings to use SQL database
5. Clear localStorage after verification

### SQL to Firebase

1. Export SQL data as JSON
2. Create Firebase project and enable Firestore
3. Use Firebase Admin SDK to import data
4. Update app settings to use Firebase
5. Deprecate SQL database after transition

### localStorage to Firebase

1. Export localStorage data as JSON
2. Create Firebase project
3. Import JSON data to Firestore
4. Update app settings to use Firebase
5. Clear localStorage after verification

---

## Configuration Examples

### MySQL Connection
```javascript
{
  "type": "sql",
  "host": "localhost",
  "port": "3306",
  "database": "scholarsync",
  "username": "root",
  "password": "your_password"
}
```

### PostgreSQL Connection
```javascript
{
  "type": "sql",
  "host": "localhost",
  "port": "5432",
  "database": "scholarsync",
  "username": "postgres",
  "password": "your_password"
}
```

### Firebase Configuration
```javascript
{
  "type": "cloud",
  "provider": "firebase",
  "apiKey": "YOUR_API_KEY",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef"
}
```

---

## Appendix: API Score Calculation

### Formula
```
API Score = (Base Score × Authorship Multiplier) / √(Total Authors)
```

### Base Scores
| Publication Type | Score |
|-----------------|-------|
| Patent | 40 |
| Book | 30 |
| Journal Article | 25 |
| Review | 20 |
| Book Chapter | 15 |
| Conference Paper | 15 |
| Thesis | 10 |

### Authorship Multipliers
| Position | Multiplier |
|----------|------------|
| First Author | 100% (1.0) |
| Second Author | 50% (0.5) |
| Co-author | 30% (0.3) |

### Examples
- First author of journal article (3 authors): (25 × 1.0) / √3 = 14.43
- Second author of patent (2 authors): (40 × 0.5) / √2 = 14.14
- Co-author of conference paper (5 authors): (15 × 0.3) / √5 = 2.01

---

*Document Version: 1.0.0*
*Last Updated: April 2026*
*ScholarSync Research Data Management Portal*
