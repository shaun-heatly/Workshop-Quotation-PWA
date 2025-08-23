# Workshop Quotation PWA - Complete Development Specification

## 🎯 Project Overview

A Progressive Web App designed for small to medium workshops (metal fabrication, welding, woodworking, general fabrication) to streamline quotation, job tracking, and material optimization. Built with a mobile-first approach for workshop environments where users may have gloves, dirty hands, or limited connectivity.

### Target Market
- Small workshops (1-10 employees) doing mixed fabrication work
- Custom fabrication shops that handle diverse projects
- Repair and maintenance workshops
- NOT targeting: Large manufacturers, field service trades, specialized CNC shops

### Core Value Proposition
- All-in-one tool replacing Excel sheets and paper quotes
- Integrated linear cutting optimizer saves material costs
- Works offline in workshop environments
- Simple enough for one-person shops, scalable for small teams

## 📁 Project Structure

```
workshop-quotation-pwa/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── quotes/
│   │   │   ├── materials/
│   │   │   ├── rates/
│   │   │   ├── jobs/
│   │   │   ├── calendar/
│   │   │   ├── cutting/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── quotes/
│   │   │   ├── materials/
│   │   │   └── sync/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/           # Shadcn/ui components
│   │   ├── forms/        # Quote, material, rate forms
│   │   ├── kanban/       # Kanban board components
│   │   ├── calendar/     # Calendar view components
│   │   └── cutting/      # Cutting optimizer components
│   ├── lib/
│   │   ├── firebase/     # Firebase config & utilities
│   │   ├── auth/         # Authentication helpers
│   │   ├── db/           # Database schemas & queries
│   │   ├── cutting/      # Cutting optimization algorithms
│   │   └── utils/        # General utilities
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   └── workers/          # Service & web workers
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── icons/            # App icons (various sizes)
│   └── offline.html      # Offline fallback page
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── config/
    ├── firebase.config.ts
    └── vercel.json
```

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel
- **Offline**: Service Workers + IndexedDB
- **Optimization**: Web Workers for cutting calculations

### PWA Configuration

```json
// public/manifest.json
{
  "name": "Workshop Quotation Manager",
  "short_name": "WQ Manager",
  "description": "Quote, track, and optimize workshop jobs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 💾 Database Schema (Firestore)

### Collections Structure

```typescript
// companies/{companyId}
interface Company {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  settings: {
    currency: string;
    timezone: string;
    taxRate: number;
    logoUrl?: string;
  };
  subscription: {
    status: 'active' | 'trial' | 'suspended';
    startDate: Timestamp;
    endDate?: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// companies/{companyId}/users/{userId}
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'estimator' | 'viewer';
  permissions: {
    materials: ('view' | 'create' | 'edit' | 'delete')[];
    rates: ('view' | 'create' | 'edit' | 'delete')[];
    quotes: ('view' | 'create' | 'edit' | 'delete' | 'approve')[];
    users: ('view' | 'create' | 'edit' | 'delete')[];
  };
  avatar?: string;
  active: boolean;
  createdAt: Timestamp;
}

// companies/{companyId}/materials/{materialId}
interface Material {
  id: string;
  category: 'steel' | 'aluminum' | 'wood' | 'plastic' | 'other';
  name: string;
  description?: string;
  specifications: {
    type?: string;           // "Box Section", "Flat Bar", etc.
    thickness?: number;      // mm
    width?: number;          // mm
    length?: number;         // mm (standard stock length)
    weight?: number;         // kg/m or kg/unit
    customFields?: Record<string, any>;
  };
  pricing: {
    unit: 'length' | 'weight' | 'piece' | 'area';
    costPerUnit: number;
    supplierPrices?: {
      supplierId: string;
      price: number;
      minQuantity?: number;
    }[];
    quantityBreaks?: {
      quantity: number;
      pricePerUnit: number;
    }[];
  };
  inventory?: {           // Pro feature
    currentStock: number;
    minStock: number;
    maxStock: number;
    location?: string;
    leadTimeDays?: number;
  };
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// companies/{companyId}/rates/{rateId}
interface Rate {
  id: string;
  category: 'labor' | 'machine' | 'overhead' | 'markup';
  name: string;
  description?: string;
  rateType: 'hourly' | 'fixed' | 'percentage';
  value: number;
  conditions?: {
    rushMultiplier?: number;      // 1.5 for rush jobs
    minCharge?: number;            // Minimum charge for this rate
    validFrom?: Timestamp;
    validTo?: Timestamp;
  };
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// companies/{companyId}/quotes/{quoteId}
interface Quote {
  id: string;
  quoteNumber: string;
  version: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  customer: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
  };
  items: QuoteItem[];
  materials: {
    materialId: string;
    quantity: number;
    wasteFactor: number;
    totalCost: number;
  }[];
  labor: {
    rateId: string;
    hours: number;
    totalCost: number;
  }[];
  totals: {
    materials: number;
    labor: number;
    overhead: number;
    subtotal: number;
    tax: number;
    total: number;
    profit: number;
    profitMargin: number;
  };
  cuttingLists?: {        // Reference to cutting optimization
    listId: string;
    materialSaved: number;
  }[];
  notes?: string;
  terms?: string;
  validUntil: Timestamp;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// companies/{companyId}/jobs/{jobId}
interface Job {
  id: string;
  quoteId: string;
  jobNumber: string;
  status: 'pending' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  phases: JobPhase[];
  assignedTo: string[];
  customer: {
    name: string;
    contact?: string;
  };
  dates: {
    quoted: Timestamp;
    approved: Timestamp;
    started?: Timestamp;
    dueDate: Timestamp;
    completed?: Timestamp;
  };
  tracking: {
    estimatedHours: number;
    actualHours: number;
    materialUsed: Record<string, number>;
    notes: Note[];
  };
  files?: {
    name: string;
    url: string;
    type: string;
    uploadedAt: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface JobPhase {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  order: number;
  assignedTo?: string;
  estimatedHours: number;
  actualHours?: number;
  completedAt?: Timestamp;
}

// companies/{companyId}/cuttingLists/{listId}
interface CuttingList {
  id: string;
  name: string;
  materialId: string;
  stockLength: number;
  cuts: Cut[];
  optimization: {
    algorithm: 'firstFit' | 'bestFit' | 'genetic';
    efficiency: number;       // Percentage
    wasteLength: number;
    stockUsed: StockPiece[];
  };
  associatedQuotes?: string[];
  createdBy: string;
  createdAt: Timestamp;
}

interface Cut {
  id: string;
  length: number;
  quantity: number;
  label?: string;
}

interface StockPiece {
  pieceNumber: number;
  cuts: {
    cutId: string;
    position: number;
    length: number;
  }[];
  remainingLength: number;
}
```

## 🔐 Security & Authentication

### Firebase Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function belongsToCompany(companyId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.uid));
    }
    
    function hasRole(companyId, role) {
      return belongsToCompany(companyId) &&
        get(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.uid)).data.role == role;
    }
    
    function hasPermission(companyId, resource, action) {
      return belongsToCompany(companyId) &&
        action in get(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.uid)).data.permissions[resource];
    }
    
    // Company rules
    match /companies/{companyId} {
      allow read: if belongsToCompany(companyId);
      allow update: if hasRole(companyId, 'admin');
      
      // Users subcollection
      match /users/{userId} {
        allow read: if belongsToCompany(companyId);
        allow write: if hasPermission(companyId, 'users', 'edit');
      }
      
      // Materials subcollection
      match /materials/{materialId} {
        allow read: if belongsToCompany(companyId) && 
          hasPermission(companyId, 'materials', 'view');
        allow create: if belongsToCompany(companyId) && 
          hasPermission(companyId, 'materials', 'create');
        allow update: if belongsToCompany(companyId) && 
          hasPermission(companyId, 'materials', 'edit');
        allow delete: if belongsToCompany(companyId) && 
          hasPermission(companyId, 'materials', 'delete');
      }
      
      // Similar rules for rates, quotes, jobs, cuttingLists...
    }
  }
}
```

### Authentication Flow

```typescript
// lib/auth/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

export async function signUp(
  email: string, 
  password: string, 
  companyName: string
) {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth, 
    email, 
    password
  );
  
  // 2. Create company document
  const companyRef = await addDoc(collection(db, 'companies'), {
    name: companyName,
    plan: 'trial',
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 0
    },
    subscription: {
      status: 'trial',
      startDate: serverTimestamp(),
      endDate: // 14 days from now
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // 3. Create user document with admin role
  await setDoc(
    doc(db, 'companies', companyRef.id, 'users', userCredential.user.uid),
    {
      email,
      name: email.split('@')[0],
      role: 'admin',
      permissions: {
        materials: ['view', 'create', 'edit', 'delete'],
        rates: ['view', 'create', 'edit', 'delete'],
        quotes: ['view', 'create', 'edit', 'delete', 'approve'],
        users: ['view', 'create', 'edit', 'delete']
      },
      active: true,
      createdAt: serverTimestamp()
    }
  );
  
  return { user: userCredential.user, companyId: companyRef.id };
}
```

## 🧩 Core Components

### 1. Materials Management

```typescript
// components/forms/MaterialForm.tsx
interface MaterialFormProps {
  material?: Material;
  onSubmit: (data: Material) => Promise<void>;
}

export function MaterialForm({ material, onSubmit }: MaterialFormProps) {
  const form = useForm<Material>({
    defaultValues: material || {
      category: 'steel',
      name: '',
      specifications: {},
      pricing: {
        unit: 'length',
        costPerUnit: 0
      },
      active: true
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="aluminum">Aluminum</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {/* Dynamic fields based on category */}
        {form.watch('category') === 'steel' && (
          <>
            <FormField name="specifications.type" />
            <FormField name="specifications.thickness" type="number" />
            <FormField name="specifications.width" type="number" />
            <FormField name="specifications.length" type="number" />
          </>
        )}
        
        {/* Pricing section with quantity breaks */}
        <PricingFields control={form.control} />
        
        <Button type="submit">Save Material</Button>
      </form>
    </Form>
  );
}
```

### 2. Linear Cutting Optimizer

```typescript
// lib/cutting/optimizer.ts
interface CutRequirement {
  length: number;
  quantity: number;
  label?: string;
}

interface OptimizationResult {
  stockPieces: StockPiece[];
  totalStockUsed: number;
  totalWaste: number;
  efficiency: number;
  cost: number;
}

export class CuttingOptimizer {
  constructor(
    private stockLength: number,
    private bladeKerf: number = 3 // mm blade width
  ) {}
  
  // First Fit Decreasing Algorithm
  optimizeFFD(requirements: CutRequirement[]): OptimizationResult {
    // Sort requirements by length (descending)
    const sortedCuts = this.expandAndSort(requirements);
    const stockPieces: StockPiece[] = [];
    
    for (const cut of sortedCuts) {
      let placed = false;
      
      // Try to fit in existing stock pieces
      for (const stock of stockPieces) {
        if (stock.remainingLength >= cut.length + this.bladeKerf) {
          stock.cuts.push({
            cutId: cut.id,
            position: this.stockLength - stock.remainingLength,
            length: cut.length
          });
          stock.remainingLength -= (cut.length + this.bladeKerf);
          placed = true;
          break;
        }
      }
      
      // Need new stock piece
      if (!placed) {
        stockPieces.push({
          pieceNumber: stockPieces.length + 1,
          cuts: [{
            cutId: cut.id,
            position: 0,
            length: cut.length
          }],
          remainingLength: this.stockLength - cut.length - this.bladeKerf
        });
      }
    }
    
    return this.calculateResults(stockPieces);
  }
  
  // Best Fit Algorithm  
  optimizeBestFit(requirements: CutRequirement[]): OptimizationResult {
    const sortedCuts = this.expandAndSort(requirements);
    const stockPieces: StockPiece[] = [];
    
    for (const cut of sortedCuts) {
      let bestFit: StockPiece | null = null;
      let minWaste = this.stockLength;
      
      // Find the best fitting stock piece
      for (const stock of stockPieces) {
        const remainingAfterCut = stock.remainingLength - (cut.length + this.bladeKerf);
        if (remainingAfterCut >= 0 && remainingAfterCut < minWaste) {
          bestFit = stock;
          minWaste = remainingAfterCut;
        }
      }
      
      if (bestFit) {
        bestFit.cuts.push({
          cutId: cut.id,
          position: this.stockLength - bestFit.remainingLength,
          length: cut.length
        });
        bestFit.remainingLength -= (cut.length + this.bladeKerf);
      } else {
        // Need new stock piece
        stockPieces.push({
          pieceNumber: stockPieces.length + 1,
          cuts: [{
            cutId: cut.id,
            position: 0,
            length: cut.length
          }],
          remainingLength: this.stockLength - cut.length - this.bladeKerf
        });
      }
    }
    
    return this.calculateResults(stockPieces);
  }
  
  private expandAndSort(requirements: CutRequirement[]) {
    const expanded = [];
    for (const req of requirements) {
      for (let i = 0; i < req.quantity; i++) {
        expanded.push({
          id: `${req.label || 'cut'}-${i + 1}`,
          length: req.length,
          originalReq: req
        });
      }
    }
    return expanded.sort((a, b) => b.length - a.length);
  }
  
  private calculateResults(stockPieces: StockPiece[]): OptimizationResult {
    const totalStockUsed = stockPieces.length;
    const totalWaste = stockPieces.reduce(
      (sum, piece) => sum + piece.remainingLength, 
      0
    );
    const totalLength = totalStockUsed * this.stockLength;
    const efficiency = ((totalLength - totalWaste) / totalLength) * 100;
    
    return {
      stockPieces,
      totalStockUsed,
      totalWaste,
      efficiency,
      cost: 0 // Calculate based on material cost
    };
  }
}

// Web Worker for heavy calculations
// workers/cutting.worker.ts
self.addEventListener('message', (event) => {
  const { requirements, stockLength, bladeKerf, algorithm } = event.data;
  
  const optimizer = new CuttingOptimizer(stockLength, bladeKerf);
  let result;
  
  switch (algorithm) {
    case 'bestFit':
      result = optimizer.optimizeBestFit(requirements);
      break;
    case 'firstFit':
    default:
      result = optimizer.optimizeFFD(requirements);
  }
  
  self.postMessage(result);
});
```

### 3. Kanban Board

```typescript
// components/kanban/KanbanBoard.tsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { id: 'quoted', title: 'Quoted' },
  { id: 'approved', title: 'Approved' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'completed', title: 'Completed' }
];

export function KanbanBoard() {
  const { jobs, updateJobStatus } = useJobs();
  
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const jobId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    await updateJobStatus(jobId, newStatus);
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "bg-gray-100 rounded-lg p-4 min-h-[500px]",
                  snapshot.isDraggingOver && "bg-blue-50"
                )}
              >
                <h3 className="font-semibold mb-4">{column.title}</h3>
                {jobs
                  .filter(job => job.status === column.id)
                  .map((job, index) => (
                    <Draggable 
                      key={job.id} 
                      draggableId={job.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "bg-white p-3 mb-2 rounded shadow",
                            snapshot.isDragging && "shadow-lg"
                          )}
                        >
                          <JobCard job={job} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
```

## 📱 Offline Functionality

### Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'workshop-quotation-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quotes') {
    event.waitUntil(syncQuotes());
  }
});

async function syncQuotes() {
  const db = await openDB('workshop-quotation', 1);
  const tx = db.transaction('pending-quotes', 'readonly');
  const quotes = await tx.objectStore('pending-quotes').getAll();
  
  for (const quote of quotes) {
    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      
      // Remove from pending after successful sync
      await db.delete('pending-quotes', quote.id);
    } catch (error) {
      console.error('Failed to sync quote:', quote.id);
    }
  }
}
```

### IndexedDB for Offline Storage

```typescript
// lib/db/indexeddb.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface WorkshopDB extends DBSchema {
  'quotes': {
    key: string;
    value: Quote;
    indexes: { 'by-status': string; 'by-customer': string };
  };
  'materials': {
    key: string;
    value: Material;
    indexes: { 'by-category': string };
  };
  'pending-sync': {
    key: string;
    value: {
      type: 'quote' | 'job' | 'material';
      action: 'create' | 'update' | 'delete';
      data: any;
      timestamp: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<WorkshopDB> | null = null;
  
  async init() {
    this.db = await openDB<WorkshopDB>('workshop-quotation', 1, {
      upgrade(db) {
        // Quotes store
        const quoteStore = db.createObjectStore('quotes', {
          keyPath: 'id'
        });
        quoteStore.createIndex('by-status', 'status');
        quoteStore.createIndex('by-customer', 'customer.name');
        
        // Materials store
        const materialStore = db.createObjectStore('materials', {
          keyPath: 'id'
        });
        materialStore.createIndex('by-category', 'category');
        
        // Pending sync store
        db.createObjectStore('pending-sync', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    });
  }
  
  async saveQuote(quote: Quote, isOffline: boolean = false) {
    if (!this.db) await this.init();
    
    await this.db!.put('quotes', quote);
    
    if (isOffline) {
      await this.db!.add('pending-sync', {
        type: 'quote',
        action: 'create',
        data: quote,
        timestamp: Date.now()
      });
      
      // Register for background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-quotes');
      }
    }
  }
  
  async getQuotes(status?: string) {
    if (!this.db) await this.init();
    
    if (status) {
      return this.db!.getAllFromIndex('quotes', 'by-status', status);
    }
    return this.db!.getAll('quotes');
  }
}

export const offlineStorage = new OfflineStorage();
```

## 🔄 State Management (Zustand)

```typescript
// store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

interface AppState {
  // Company state
  company: Company | null;
  setCompany: (company: Company) => void;
  
  // User state
  user: User | null;
  setUser: (user: User) => void;
  
  // Materials state
  materials: Material[];
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  
  // Rates state
  rates: Rate[];
  addRate: (rate: Rate) => void;
  updateRate: (id: string, rate: Partial<Rate>) => void;
  
  // Quotes state
  quotes: Quote[];
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote | null) => void;
  addQuoteItem: (item: QuoteItem) => void;
  removeQuoteItem: (itemId: string) => void;
  calculateQuoteTotals: () => void;
  
  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Sync state
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSync: Date | null;
  pendingSyncs: number;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Company
        company: null,
        setCompany: (company) => set({ company }),
        
        // User
        user: null,
        setUser: (user) => set({ user }),
        
        // Materials
        materials: [],
        addMaterial: (material) => 
          set((state) => ({ 
            materials: [...state.materials, material] 
          })),
        updateMaterial: (id, updates) =>
          set((state) => ({
            materials: state.materials.map(m => 
              m.id === id ? { ...m, ...updates } : m
            )
          })),
        deleteMaterial: (id) =>
          set((state) => ({
            materials: state.materials.filter(m => m.id !== id)
          })),
        
        // Rates
        rates: [],
        addRate: (rate) =>
          set((state) => ({ 
            rates: [...state.rates, rate] 
          })),
        updateRate: (id, updates) =>
          set((state) => ({
            rates: state.rates.map(r => 
              r.id === id ? { ...r, ...updates } : r
            )
          })),
        
        // Quotes
        quotes: [],
        currentQuote: null,
        setCurrentQuote: (quote) => set({ currentQuote: quote }),
        addQuoteItem: (item) =>
          set((state) => ({
            currentQuote: state.currentQuote ? {
              ...state.currentQuote,
              items: [...state.currentQuote.items, item]
            } : null
          })),
        removeQuoteItem: (itemId) =>
          set((state) => ({
            currentQuote: state.currentQuote ? {
              ...state.currentQuote,
              items: state.currentQuote.items.filter(i => i.id !== itemId)
            } : null
          })),
        calculateQuoteTotals: () => {
          const quote = get().currentQuote;
          if (!quote) return;
          
          const materials = quote.materials.reduce(
            (sum, m) => sum + m.totalCost, 0
          );
          const labor = quote.labor.reduce(
            (sum, l) => sum + l.totalCost, 0
          );
          const subtotal = materials + labor;
          const tax = subtotal * (get().company?.settings.taxRate || 0) / 100;
          const total = subtotal + tax;
          
          set((state) => ({
            currentQuote: state.currentQuote ? {
              ...state.currentQuote,
              totals: {
                materials,
                labor,
                overhead: 0,
                subtotal,
                tax,
                total,
                profit: 0,
                profitMargin: 0
              }
            } : null
          }));
        },
        
        // UI
        sidebarOpen: true,
        toggleSidebar: () => 
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        
        // Sync
        syncStatus: 'idle',
        lastSync: null,
        pendingSyncs: 0
      }),
      {
        name: 'workshop-quotation-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          materials: state.materials,
          rates: state.rates,
          currentQuote: state.currentQuote,
          sidebarOpen: state.sidebarOpen
        })
      }
    )
  )
);
```

## 🎨 UI/UX Guidelines

### Design Principles
1. **Touch-Friendly**: Minimum 44px touch targets
2. **High Contrast**: For outdoor/bright light visibility
3. **Glove-Compatible**: Large buttons, swipe gestures
4. **Information Density**: Show key info without scrolling
5. **Offline Indicators**: Clear sync status visibility

### Mobile-First Responsive Design

```css
/* Breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }

/* Touch-friendly spacing */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  @apply flex items-center justify-center;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔌 API Endpoints

```typescript
// app/api/quotes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');
  
  let query = db.collection(`companies/${session.companyId}/quotes`);
  
  if (status) {
    query = query.where('status', '==', status);
  }
  if (customerId) {
    query = query.where('customer.id', '==', customerId);
  }
  
  const snapshot = await query.get();
  const quotes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return NextResponse.json(quotes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  
  // Validate quote data
  if (!data.customer?.name || !data.items?.length) {
    return NextResponse.json(
      { error: 'Invalid quote data' }, 
      { status: 400 }
    );
  }
  
  // Generate quote number
  const quoteNumber = await generateQuoteNumber(session.companyId);
  
  const quote = {
    ...data,
    quoteNumber,
    version: 1,
    status: 'draft',
    createdBy: session.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await db
    .collection(`companies/${session.companyId}/quotes`)
    .add(quote);
  
  return NextResponse.json({ 
    id: docRef.id, 
    ...quote 
  });
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// tests/unit/cutting-optimizer.test.ts
import { CuttingOptimizer } from '@/lib/cutting/optimizer';

describe('CuttingOptimizer', () => {
  const optimizer = new CuttingOptimizer(6000, 3); // 6m stock, 3mm kerf
  
  test('should optimize simple cuts with FFD', () => {
    const requirements = [
      { length: 2000, quantity: 2, label: 'A' },
      { length: 1500, quantity: 3, label: 'B' },
      { length: 1000, quantity: 2, label: 'C' }
    ];
    
    const result = optimizer.optimizeFFD(requirements);
    
    expect(result.stockPieces).toHaveLength(2);
    expect(result.efficiency).toBeGreaterThan(80);
  });
  
  test('should handle edge cases', () => {
    const requirements = [
      { length: 6000, quantity: 1, label: 'MAX' }
    ];
    
    const result = optimizer.optimizeFFD(requirements);
    
    expect(result.stockPieces).toHaveLength(1);
    expect(result.efficiency).toBeCloseTo(100, 1);
  });
});
```

### Integration Tests

```typescript
// tests/integration/quote-workflow.test.ts
import { createQuote, approveQuote, convertToJob } from '@/lib/quotes';

describe('Quote Workflow', () => {
  test('should create, approve, and convert quote to job', async () => {
    // Create quote
    const quote = await createQuote({
      customer: { name: 'Test Customer' },
      items: [{ description: 'Test Item', quantity: 1, unitPrice: 100 }]
    });
    
    expect(quote.status).toBe('draft');
    
    // Approve quote
    const approved = await approveQuote(quote.id);
    expect(approved.status).toBe('approved');
    
    // Convert to job
    const job = await convertToJob(quote.id);
    expect(job.quoteId).toBe(quote.id);
    expect(job.status).toBe('pending');
  });
});
```

## 🚀 Deployment

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Server-side only
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### Vercel Configuration

```json
// vercel.json
{
  "functions": {
    "app/api/quotes/route.ts": {
      "maxDuration": 10
    },
    "app/api/cutting/optimize/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Content-Type",
          "value": "application/javascript; charset=utf-8"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring & Analytics

```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Track custom events
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
}

// Track quote lifecycle
export function trackQuoteEvent(quoteId: string, event: 'created' | 'sent' | 'approved' | 'rejected') {
  trackEvent(`quote_${event}`, {
    quote_id: quoteId,
    timestamp: new Date().toISOString()
  });
}
```

## 🔄 Version Control & Git Strategy

```bash
# Branch structure
main                 # Production
├── develop         # Development
├── feature/*       # New features
├── bugfix/*        # Bug fixes
└── hotfix/*        # Emergency fixes

# Commit convention
feat: Add material inventory tracking
fix: Correct cutting optimization for edge cases
docs: Update API documentation
style: Format code with prettier
refactor: Restructure quote calculation logic
test: Add unit tests for rate calculations
chore: Update dependencies
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "firebase": "^10.7.0",
    "firebase-admin": "^12.0.0",
    "zustand": "^4.4.0",
    "@hello-pangea/dnd": "^16.5.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "idb": "^8.0.0",
    "workbox-*": "^7.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## 🎯 Phase 1 MVP Features (Weeks 1-2)
- [ ] User authentication & company setup
- [ ] Basic materials database
- [ ] Simple quote creation
- [ ] Linear cutting optimizer
- [ ] Offline support
- [ ] Mobile-responsive UI

## 🚀 Phase 2 Core Features (Weeks 3-4)
- [ ] Advanced materials with inventory
- [ ] Labor rates & overhead calculation
- [ ] Quote versioning & templates
- [ ] Kanban job tracking
- [ ] Basic calendar view
- [ ] Export to PDF

## 💎 Phase 3 Pro Features (Weeks 5-6)
- [ ] Multi-user permissions
- [ ] Advanced reporting
- [ ] Accounting software export (CSV/API)
- [ ] Inventory forecasting
- [ ] Customer portal
- [ ] Automated follow-ups

## 📈 Phase 4 Growth Features (Weeks 7-8)
- [ ] API for integrations
- [ ] White-label options
- [ ] Advanced analytics
- [ ] Barcode scanning
- [ ] Photo attachments
- [ ] Time tracking

## 🤝 Contributing Guidelines

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:
- GitHub Issues: [your-repo-url]/issues
- Email: support@your-domain.com
- Documentation: [your-docs-url]

---

Built with ❤️ for workshops that build things
