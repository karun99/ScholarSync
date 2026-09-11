# Firebase Schema

## Overview

ScholarSync supports Firebase Realtime Database and Firestore for cloud-based data persistence. This enables multi-user access, real-time synchronization, and cross-device data persistence.

## Prerequisites

1. Firebase Project created at [console.firebase.google.com](https://console.firebase.google.com)
2. Authentication enabled (Email/Password recommended)
3. Firestore Database or Realtime Database enabled
4. Firebase SDK configured in the application

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "ScholarSync"
4. Disable Google Analytics (optional) or configure as needed
5. Click "Create project"

### Step 2: Enable Authentication

1. Go to Build > Authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. (Optional) Enable Google, GitHub, or other providers

### Step 3: Create Firestore Database

1. Go to Build > Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Enable"

### Step 4: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (`</>`) to add web app
4. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## Firestore Collections Structure

### users Collection
```
Collection: users
Document ID: Firebase UID (from Authentication)

users/{userId}
├── username: string
├── role: string (researcher | dept_hod | research_cell_admin | college_admin)
├── department: string
├── email: string
├── fullName: string
├── orcid: string (optional)
├── country: string (default: "India")
├── keywords: string (optional)
├── biography: string (optional)
├── website: string (optional)
├── linkedin: string (optional)
├── googleScholar: string (optional)
├── researchGate: string (optional)
├── createdAt: timestamp
└── updatedAt: timestamp
```

### research_data Collection
```
Collection: research_data
Document ID: Auto-generated Firestore ID

research_data/{researchId}
├── title: string
├── abstract: string
├── keywords: string
├── r_department: string
├── submission_date: timestamp
├── author_id: string (Firebase UID)
├── author_name: string
├── status: string (Pending HOD | Pending Research Cell | Approved by College | Rejected)
├── file_path: string (optional)

├── publicationType: string
├── authorshipPosition: string
├── totalAuthors: number
├── apiScore: number

├── journalName: string (optional)
├── volume: string (optional)
├── issue: string (optional)
├── pages: string (optional)
├── doi: string (optional)
├── impactFactor: number (optional)

├── conferenceName: string (optional)
├── conferenceLocation: string (optional)
├── conferenceDate: timestamp (optional)

├── bookTitle: string (optional)
├── editors: string (optional)
├── publisher: string (optional)

├── patentNumber: string (optional)
├── patentOffice: string (optional)
├── filingDate: timestamp (optional)
├── grantDate: timestamp (optional)
├── patentStatus: string (optional)

├── university: string (optional)
├── supervisor: string (optional)
├── thesisDepartment: string (optional)
├── thesisType: string (optional)

├── rejectionReason: string (optional)
├── hodApprovedAt: timestamp (optional)
├── hodApprovedBy: string (optional)
├── hodComments: string (optional)
├── rcApprovedAt: timestamp (optional)
├── rcApprovedBy: string (optional)
├── rcComments: string (optional)
├── collegeApprovedAt: timestamp (optional)
├── collegeApprovedBy: string (optional)
├── collegeComments: string (optional)

├── createdAt: timestamp
└── updatedAt: timestamp
```

### messages Collection
```
Collection: messages
Document ID: Auto-generated Firestore ID

messages/{messageId}
├── senderId: string (Firebase UID)
├── senderName: string
├── senderRole: string
├── content: string
├── timestamp: timestamp
├── isAnnouncement: boolean
├── department: string
├── isPinned: boolean (default: false)
└── createdAt: timestamp
```

### settings Collection
```
Collection: settings
Document ID: "app_settings"

settings/app_settings
├── institutionName: string
├── institutionTagline: string
├── logoUrl: string
├── primaryColor: string
├── accentColor: string
├── contactEmail: string
├── contactPhone: string
├── address: string
├── website: string
├── welcomeMessage: string
├── announcementBanner: string
├── enableAnnouncementBanner: boolean
├── maintenanceMode: boolean
├── maintenanceMessage: string
├── aboutContent: object
└── appendixContent: object
```

---

## Firestore Indexes

Create the following composite indexes for optimal query performance:

### Firestore Console Indexes

| Collection | Fields | Index Type |
|-----------|--------|------------|
| research_data | status ASC, submission_date DESC | Composite |
| research_data | r_department ASC, status ASC | Composite |
| research_data | author_id ASC, submission_date DESC | Composite |
| research_data | r_department ASC, submission_date DESC | Composite |
| messages | timestamp DESC | Single Field |
| messages | department ASC, timestamp DESC | Composite |

### indexes.json
```json
{
  "indexes": [
    {
      "collectionGroup": "research_data",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "submission_date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "research_data",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "r_department", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "research_data",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "author_id", "order": "ASCENDING" },
        { "fieldPath": "submission_date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "department", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## Firestore Security Rules

### firestore.rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'college_admin';
    }
    
    function isHOD() {
      return isAuthenticated() && getUserRole() == 'dept_hod';
    }
    
    function isRCAdmin() {
      return isAuthenticated() && getUserRole() == 'research_cell_admin';
    }
    
    function isApprover() {
      return isAuthenticated() && 
        (getUserRole() == 'dept_hod' || 
         getUserRole() == 'research_cell_admin' || 
         getUserRole() == 'college_admin');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Research data collection
    match /research_data/{researchId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isApprover() || 
        (isOwner(resource.data.author_id) && 
         resource.data.status == 'Pending HOD');
      allow delete: if isAdmin();
      
      // Sub-collection for attachments (if needed)
      match /attachments/{attachmentId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.senderId) || isApprover();
      allow delete: if isOwner(resource.data.senderId) || isAdmin();
    }
    
    // Settings collection
    match /settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## Realtime Database Structure

If using Realtime Database instead of Firestore:

```json
{
  "users": {
    "$uid": {
      "username": "researcher1",
      "role": "researcher",
      "department": "Computer Science",
      "email": "researcher1@college.edu",
      "fullName": "Dr. Alice Johnson"
    }
  },
  "research_data": {
    "$pushId": {
      "title": "Machine Learning in Healthcare",
      "status": "Pending HOD",
      "author_id": "$uid",
      "apiScore": 14.43,
      "submission_date": "2024-01-15"
    }
  },
  "messages": {
    "$pushId": {
      "senderId": "$uid",
      "senderName": "Dr. Alice Johnson",
      "content": "Welcome message",
      "timestamp": 1705312200000,
      "isAnnouncement": true
    }
  },
  "settings": {
    "institutionName": "ScholarSync",
    "primaryColor": "#6366f1"
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    ".read": "auth != null",
    "users": {
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "research_data": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "settings": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'college_admin'"
    }
  }
}
```

---

## Firebase SDK Integration

### Install Firebase SDK
```bash
npm install firebase
```

### Initialize Firebase
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Sample CRUD Operations

```javascript
import { 
  collection, addDoc, getDocs, getDoc, 
  updateDoc, deleteDoc, doc, query, where,
  orderBy, onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

// Create Research Entry
async function createResearch(data) {
  const docRef = await addDoc(collection(db, 'research_data'), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
}

// Read Research Data
async function getResearchByDepartment(department) {
  const q = query(
    collection(db, 'research_data'),
    where('r_department', '==', department),
    orderBy('submission_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update Research Status
async function updateResearchStatus(id, status, userId, comments) {
  const docRef = doc(db, 'research_data', id);
  const updateData = {
    status,
    updatedAt: new Date()
  };
  
  if (status === 'Pending Research Cell') {
    updateData.hodApprovedAt = new Date();
    updateData.hodApprovedBy = userId;
    updateData.hodComments = comments;
  } else if (status === 'Approved by College') {
    updateData.rcApprovedAt = new Date();
    updateData.rcApprovedBy = userId;
    updateData.collegeApprovedAt = new Date();
    updateData.collegeApprovedBy = userId;
  }
  
  await updateDoc(docRef, updateData);
}

// Real-time Listener
function subscribeToResearch(callback) {
  return onSnapshot(collection(db, 'research_data'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}
```

---

## Migration from localStorage to Firebase

### Step 1: Export localStorage Data
```javascript
function exportToFirebaseFormat() {
  const data = {
    users: JSON.parse(localStorage.getItem('scholarsync_users')),
    researchData: JSON.parse(localStorage.getItem('scholarsync_rdata')),
    messages: JSON.parse(localStorage.getItem('scholarsync_messages')),
    settings: JSON.parse(localStorage.getItem('scholarsync_settings'))
  };
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  // ... save file
}
```

### Step 2: Import to Firebase
```javascript
import { batch, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

async function importToFirebase(data) {
  const batch = writeBatch(db);
  
  // Import users
  for (const user of data.users) {
    const userRef = doc(db, 'users', user.id.toString());
    batch.set(userRef, { ...user, createdAt: new Date() });
  }
  
  // Import research data
  for (const research of data.researchData) {
    const researchRef = doc(collection(db, 'research_data'));
    batch.set(researchRef, { ...research, createdAt: new Date() });
  }
  
  // Import messages
  for (const message of data.messages) {
    const messageRef = doc(collection(db, 'messages'));
    batch.set(messageRef, { ...message, createdAt: new Date() });
  }
  
  await batch.commit();
}
```

---

## Firebase Pricing Tiers

| Feature | Spark (Free) | Blaze (Pay as you go) |
|---------|--------------|----------------------|
| Firestore Storage | 1 GB | $0.18/GB |
| Reads | 50,000/day | $0.036/100K |
| Writes | 20,000/day | $0.108/100K |
| Deletes | 20,000/day | Free |
| Realtime DB Storage | 1 GB | $5/GB |
| Realtime DB Bandwidth | 10 GB/mo | $1-8/GB |

**Note**: Firebase has generous free tiers suitable for small to medium deployments.
