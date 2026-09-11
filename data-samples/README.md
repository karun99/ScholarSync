# ScholarSync Data Samples

This folder contains sample data files for importing into ScholarSync for testing, demonstration, or initial setup purposes.

## Folder Structure

```
data-samples/
├── json/                    # JSON format files
│   ├── users.json          # Sample user accounts
│   ├── research_data.json   # Sample research submissions
│   ├── messages.json        # Sample announcements/messages
│   └── complete_backup.json # Complete data backup (all tables)
└── csv/                     # CSV format files
    ├── users.csv            # Sample user accounts
    ├── research_data.csv    # Sample research submissions
    └── messages.csv         # Sample announcements/messages
```

## JSON Files

### users.json
Contains 10 sample user accounts with various roles:
- 4 Researchers
- 3 Department HODs
- 1 Research Cell Admin
- 1 College Admin
- 1 Additional Researcher

### research_data.json
Contains 15 sample research submissions covering:
- Journal Articles
- Conference Papers
- Books
- Book Chapters
- Patents
- Reviews
- Theses

With various statuses:
- Pending HOD
- Pending Research Cell
- Approved by College
- Rejected

### messages.json
Contains 15 sample announcements and messages for the announcements feed.

### complete_backup.json
A single JSON file containing all data in the format expected by the app's import function.

## CSV Files

CSV files are compatible with spreadsheet applications and SQL database import tools.

### Import to Excel/Google Sheets
1. Open the CSV file in Excel or Google Sheets
2. Edit as needed
3. Export back to CSV for import

### Import to MySQL/PostgreSQL
```sql
LOAD DATA INFILE 'users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

## Default Credentials

| Username | Password | Role |
|----------|----------|------|
| researcher1 | pass123 | Researcher |
| faculty2 | pass123 | Researcher |
| rc_admin | pass123 | Research Cell Admin |
| hod_cs | pass123 | Department HOD (CS) |
| hod_ee | pass123 | Department HOD (EE) |
| college_admin | pass123 | College Admin |
| researcher3 | pass123 | Researcher |
| hod_mech | pass123 | Department HOD (ME) |
| researcher4 | pass123 | Researcher |
| hod_civil | pass123 | Department HOD (CE) |

## Departments

- Computer Science (CS)
- Electrical Engineering (EE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Research Cell (RCA)
- College Administration

## Import Instructions

### Via App Interface
1. Login as College Admin
2. Navigate to Profile page
3. Click "Import Data" button
4. Select the JSON file
5. Confirm import

### Via localStorage
1. Open browser developer console (F12)
2. Execute:
```javascript
// Import complete_backup.json content here
const data = { ... }; // paste JSON content
localStorage.setItem('scholarsync_users', JSON.stringify(data.users));
localStorage.setItem('scholarsync_rdata', JSON.stringify(data.researchData));
localStorage.setItem('scholarsync_messages', JSON.stringify(data.messages));
localStorage.setItem('scholarsync_settings', JSON.stringify(data.settings));
location.reload();
```

## Data Validation

Sample data includes:
- Valid ORCID identifiers (format: 0000-0000-0000-0000)
- Realistic publication types and metrics
- Proper status workflow progression
- Meaningful abstracts and keywords

## Customization

To customize for your institution:
1. Update user names and emails
2. Change department names to match your organization
3. Add/remove research entries as needed
4. Update institution-specific settings

## File Sizes

| File | Size (approx) |
|------|--------------|
| users.json | 4 KB |
| research_data.json | 12 KB |
| messages.json | 6 KB |
| complete_backup.json | 20 KB |
| users.csv | 3 KB |
| research_data.csv | 8 KB |
| messages.csv | 5 KB |

## Support

For questions about data format or import issues, refer to the main SCHEMAS.md documentation or the app's source code.
