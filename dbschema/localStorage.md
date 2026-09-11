# localStorage Schema

## Overview

localStorage is the default, zero-configuration database option for ScholarSync. It stores all data as JSON strings in the browser's localStorage API.

## Storage Keys

| Key | Data Type | Description | Max Size |
|-----|-----------|-------------|----------|
| `scholarsync_users` | Array | User accounts | ~2MB |
| `scholarsync_rdata` | Array | Research submissions | ~2MB |
| `scholarsync_messages` | Array | Announcements/messages | ~1MB |
| `scholarsync_settings` | Object | App configuration | ~500KB |
| `scholarsync_auth` | Object | Current session | ~1KB |
| `scholarsync_profile_{id}` | Object | User profiles | ~100KB each |

## Total Storage Capacity

- **Typical limit**: 5-10 MB (browser dependent)
- **Chrome/Safari**: ~5-10 MB per domain
- **Firefox**: ~10 MB per domain
- **Edge**: ~10 MB per domain

## Data Structures

### Users Array
```javascript
[
  {
    id: 1,
    username: "researcher1",
    password: "pass123",
    role: "researcher", // researcher | dept_hod | research_cell_admin | college_admin
    department: "Computer Science",
    email: "researcher1@college.edu",
    fullName: "Dr. Alice Johnson",
    orcid: "0000-0002-1234-5678",
    country: "India",
    keywords: "Machine Learning, AI",
    biography: "Senior researcher...",
    googleScholar: "https://..."
  }
]
```

### Research Data Array
```javascript
[
  {
    r_id: 1,
    title: "Machine Learning in Healthcare",
    abstract: "Research abstract...",
    keywords: "ML, healthcare, AI",
    r_department: "Computer Science",
    submission_date: "2024-01-15",
    author_id: 1,
    status: "Approved by College",
    // Possible statuses:
    // - "Pending HOD"
    // - "Pending Research Cell"  
    // - "Approved by College"
    // - "Rejected"
    publicationType: "journal-article",
    // Possible types:
    // - "journal-article"
    // - "conference-paper"
    // - "book"
    // - "book-chapter"
    // - "patent"
    // - "review"
    // - "thesis"
    authorshipPosition: "first-author",
    totalAuthors: 3,
    apiScore: 14.43
  }
]
```

### Messages Array
```javascript
[
  {
    id: 1,
    senderId: 6,
    senderName: "Dr. Frank Miller",
    senderRole: "college_admin",
    content: "Welcome message...",
    timestamp: "2024-01-10T09:00:00",
    isAnnouncement: true,
    department: "College Administration"
  }
]
```

### Settings Object
```javascript
{
  institutionName: "ScholarSync",
  institutionTagline: "Research Data Management Portal",
  logoUrl: "",
  primaryColor: "#6366f1",
  accentColor: "#818cf8",
  contactEmail: "research@college.edu",
  contactPhone: "+1 234 567 8900",
  address: "123 University Avenue",
  website: "www.college.edu",
  welcomeMessage: "Welcome to ScholarSync...",
  announcementBanner: "",
  enableAnnouncementBanner: false,
  maintenanceMode: false,
  maintenanceMessage: "System under maintenance...",
  database: {
    type: "local",
    local: { enabled: true },
    sql: { enabled: false, ... },
    cloud: { enabled: false, ... }
  },
  aboutContent: {
    description: "...",
    modules: [...],
    securityFeatures: [...],
    keyFeatures: [...]
  },
  appendixContent: {
    academicDatabases: [...],
    publishers: [...],
    searchEngines: [...],
    repositories: [...],
    aiTools: [...],
    citationTools: [...]
  }
}
```

## Operations

### Read Data
```javascript
const users = JSON.parse(localStorage.getItem('scholarsync_users'));
const rdata = JSON.parse(localStorage.getItem('scholarsync_rdata'));
const messages = JSON.parse(localStorage.getItem('scholarsync_messages'));
const settings = JSON.parse(localStorage.getItem('scholarsync_settings'));
```

### Write Data
```javascript
localStorage.setItem('scholarsync_users', JSON.stringify(users));
localStorage.setItem('scholarsync_rdata', JSON.stringify(rdata));
localStorage.setItem('scholarsync_settings', JSON.stringify(settings));
```

### Delete Data
```javascript
localStorage.removeItem('scholarsync_users');
localStorage.clear(); // Clears all ScholarSync data
```

## Backup & Restore

### Export
```javascript
function backupLocalStorage() {
  const data = {
    users: JSON.parse(localStorage.getItem('scholarsync_users')),
    researchData: JSON.parse(localStorage.getItem('scholarsync_rdata')),
    messages: JSON.parse(localStorage.getItem('scholarsync_messages')),
    settings: JSON.parse(localStorage.getItem('scholarsync_settings')),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scholarsync_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
```

### Import
```javascript
function importLocalStorage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    if (data.users) localStorage.setItem('scholarsync_users', JSON.stringify(data.users));
    if (data.researchData) localStorage.setItem('scholarsync_rdata', JSON.stringify(data.researchData));
    if (data.messages) localStorage.setItem('scholarsync_messages', JSON.stringify(data.messages));
    if (data.settings) localStorage.setItem('scholarsync_settings', JSON.stringify(data.settings));
    alert('Import successful!');
    window.location.reload();
  };
  reader.readAsText(file);
}
```

## Limitations

| Limitation | Description |
|------------|-------------|
| **Storage Size** | ~5-10 MB maximum |
| **String Only** | Only stores strings, objects must be serialized |
| **Same Origin** | Data isolated to the origin (domain) |
| **No Server Access** | Client-side only |
| **Single User** | No concurrent access support |
| **No Query Language** | Must load all data and filter in JS |
| **Persistence** | Data persists until explicitly cleared |

## Best Practices

1. **Regular Backups**: Export data regularly to prevent data loss
2. **Data Cleanup**: Remove old/irrelevant data to stay within limits
3. **Compression**: For large datasets, consider compressing before storage
4. **Profile Pictures**: Store as URLs, not base64 (too large)
5. **File Storage**: Don't store files in localStorage, use file paths or cloud storage

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Full | ~10MB limit |
| Firefox | Full | ~10MB limit |
| Safari | Full | ~5MB limit |
| Edge | Full | ~10MB limit |
| IE | Partial | 4KB limit in older versions |

## Security Considerations

1. **No Encryption**: Data stored in plain text
2. **XSS Vulnerable**: Accessible via JavaScript injection
3. **Physical Access**: Anyone with device access can read data
4. **No Access Control**: Any script on page can read/write

**Recommendation**: Use HTTPS in production and consider server-side storage for sensitive data.
