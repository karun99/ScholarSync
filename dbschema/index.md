# ScholarSync Database Schema Documentation

This folder contains comprehensive documentation for all database configurations supported by ScholarSync.

## Quick Links

| Database | Best For | Setup Complexity |
|----------|----------|-----------------|
| [localStorage](localStorage.md) | Development, demos, single user | None |
| [SQL](SQL.md) | Production, multi-user, large datasets | Medium |
| [Firebase](Firebase.md) | Cloud, real-time sync, scalable | Low |

## Choosing a Database

### Use localStorage when:
- Developing or testing the application
- Running a demo with a single user
- Need zero-configuration setup
- Data volume is small (< 5MB)

### Use SQL when:
- Running production with multiple concurrent users
- Need ACID compliance and data integrity
- Have existing database infrastructure
- Need complex queries and reporting

### Use Firebase when:
- Want cloud-hosted, managed solution
- Need real-time synchronization
- Building mobile-first or cross-platform apps
- Want authentication built-in

## Documentation Files

### [README.md](README.md)
Complete overview including:
- All supported database types
- Schema definitions
- Data import/export formats
- Migration guides
- API score calculation

### [localStorage.md](localStorage.md)
localStorage-specific documentation:
- Storage keys and structure
- Data operations (CRUD)
- Backup and restore procedures
- Limitations and browser compatibility
- Security considerations

### [SQL.md](SQL.md)
SQL database documentation:
- Supported databases (MySQL, PostgreSQL, SQLite, etc.)
- Complete CREATE TABLE statements
- Indexes, views, and triggers
- Stored procedures
- Sample data insertion
- Connection configuration

### [Firebase.md](Firebase.md)
Firebase documentation:
- Firebase Console setup
- Firestore collection structure
- Security rules
- Realtime Database alternative
- SDK integration examples
- Migration from localStorage

## Common Tasks

### Export Data from localStorage
```javascript
const data = {
  users: JSON.parse(localStorage.getItem('scholarsync_users')),
  researchData: JSON.parse(localStorage.getItem('scholarsync_rdata')),
  messages: JSON.parse(localStorage.getItem('scholarsync_messages')),
  exportDate: new Date().toISOString()
};
console.log(JSON.stringify(data, null, 2));
```

### Import to SQL
1. Export data as JSON
2. Parse and transform to CSV
3. Use SQL LOAD DATA or INSERT statements
4. Verify with SELECT queries

### Switch to Firebase
1. Create Firebase project
2. Enable Firestore
3. Update app settings with Firebase config
4. Import existing data

## Version

- Schema Version: 1.0.0
- Last Updated: April 2026
- Compatible with: ScholarSync v1.0+

## Contributing

If you discover issues or have suggestions for the documentation, please open an issue on GitHub.

## License

Part of ScholarSync Research Data Management Portal
