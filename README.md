# Workshop Quotation PWA - Desktop Application

## 🎯 Project Overview

A desktop Progressive Web App designed for small to medium workshops (metal fabrication, welding, woodworking, general fabrication) to streamline quotations, job tracking, and material cutting optimization. Built as a local-first application with annual licensing model.

### Target Market
- Small workshops (1-10 employees) doing mixed fabrication work
- Custom fabrication shops that handle diverse projects
- Repair and maintenance workshops
- NOT targeting: Large manufacturers, field service trades, specialized CNC shops

### Core Value Proposition
- Desktop application with local data storage
- Integrated linear cutting optimizer saves material costs
- Annual license model - own your data
- Simple cutting optimization using longest-first algorithm
- PDF quote and job sheet generation

## 📁 Project Structure

```
workshop-quotation/
├── apps/
│   ├── website/                    # Marketing & sales site (Vercel)
│   │   ├── src/app/
│   │   │   ├── pricing/
│   │   │   ├── download/
│   │   │   └── api/
│   │   │       ├── purchase/
│   │   │       ├── validate-license/
│   │   │       └── generate-license/
│   │   └── components/
│   └── desktop-app/                # PWA application
│       ├── src/
│       │   ├── app/
│       │   │   ├── quotes/
│       │   │   ├── materials/
│       │   │   ├── jobs/
│       │   │   ├── cutting/
│       │   │   └── settings/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   ├── forms/
│       │   │   ├── cutting/
│       │   │   └── pdf/
│       │   ├── lib/
│       │   │   ├── storage/        # File system access
│       │   │   ├── cutting/        # Optimization algorithms
│       │   │   ├── pdf/            # PDF generation
│       │   │   └── validation/     # License validation
│       │   └── types/
│       └── public/
│           ├── manifest.json
│           └── icons/
└── packages/
    └── shared/                     # Shared types between apps
        └── types/
```

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) 
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Storage**: Local JSON files via File System Access API
- **PDF Generation**: jsPDF
- **Deployment**: Vercel (both website and PWA)
- **Sync**: User-controlled (OneDrive, Google Drive, etc.)
- **Licensing**: Annual license key system

### Desktop PWA Features
- File System Access API for local data storage
- Installable via Chrome/Edge
- Works offline after initial license validation
- User selects storage location (enables cloud sync)
- No ongoing server dependencies for core functionality

## 💾 Data Storage (Local JSON Files)

### File Structure in User's Selected Folder
```
WorkshopData/
├── materials.json
├── quotes.json
├── jobs.json
├── rates.json
├── cutting-lists.json
├── settings.json
└── license.json
```

### Data Schemas

```typescript
// materials.json
interface Material {
  id: string;
  category: 'steel' | 'aluminum' | 'wood' | 'plastic' | 'other';
  name: string;
  description?: string;
  specifications: {
    thickness?: number;      // mm
    width?: number;          // mm
    standardLength?: number; // mm (4000, 6000, etc.)
    weight?: number;         // kg/m
  };
  costPerMeter: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// quotes.json
interface Quote {
  id: string;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  customer: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  items: QuoteItem[];
  materials: MaterialUsage[];
  cuttingList?: {
    cuts: Cut[];
    optimization: OptimizationResult;
  };
  totals: {
    materials: number;
    labor: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}

// jobs.json
interface Job {
  id: string;
  quoteId: string;
  jobNumber: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  estimatedHours: number;
  actualHours?: number;
  materialAllocations: MaterialAllocation[];
  notes: string[];
  createdAt: string;
  completedAt?: string;
}
```

## 🔧 Cutting Optimizer - Simplified Approach

### Algorithm: Longest First Fit
```typescript
interface Cut {
  length: number;
  quantity: number;
  label: string;
}

interface StockPiece {
  length: number;
  cuts: PlacedCut[];
  remaining: number;
}

interface OptimizationResult {
  stockNeeded: number;
  stockUsed: StockPiece[];
  totalWaste: number;
  efficiency: number;
}

class SimpleCuttingOptimizer {
  constructor(
    private stockLength: number = 4000, // 4m standard
    private bladeKerf: number = 3       // 3mm blade
  ) {}
  
  optimize(cuts: Cut[], existingStock?: StockPiece[]): OptimizationResult {
    // 1. Sort all cuts by length (longest first)
    // 2. Try to fit each cut in existing stock pieces
    // 3. Create new stock pieces as needed
    // 4. Track waste and efficiency
  }
}
```

### Visual Output
Simple text-based cut list:
```
Stock Piece 1 (4000mm):
├── Cut A: 545mm (pos: 0-545)
├── Cut B: 545mm (pos: 548-1093)  
├── Cut C: 545mm (pos: 1096-1641)
└── Remaining: 2356mm

Stock Piece 2 (4000mm):
├── Cut D: 440mm (pos: 0-440)
├── Cut E: 440mm (pos: 443-883)
└── Remaining: 3114mm
```

## 🔐 License System

### Annual License Model
```typescript
interface License {
  key: string;              // "WQ2024-ABCD-1234-EFGH"
  email: string;
  issuedAt: string;
  expiresAt: string;
  features: string[];       // ["cutting", "pdf", "advanced"]
  validated: boolean;
  lastValidated?: string;
}
```

### Validation Flow
1. User enters license key in app
2. App calls `/api/validate-license` (one-time online check)
3. Stores validation locally in `license.json`
4. App works offline until expiry
5. Shows renewal reminders 30 days before expiry

## 📊 Core Features

### Phase 1: Essential Features
- [x] Local data storage with File System Access
- [x] Materials database management
- [x] Quote creation and calculation
- [x] Simple cutting optimizer (longest-first algorithm)
- [x] PDF quote generation
- [x] License validation system

### Phase 2: Job Management
- [x] Convert quotes to jobs
- [x] Job status tracking
- [x] Material allocation to jobs
- [x] PDF job sheets with BOM
- [x] Time tracking (estimated vs actual)

### Phase 3: Advanced Features
- [x] Cutting list visualization
- [x] Multiple material types support
- [x] Labor rate calculations
- [x] Data backup/restore (ZIP export/import)
- [x] Customer management

## 🎨 UI/UX Guidelines

### Desktop-First Design
- Optimized for mouse and keyboard
- Multi-window support
- Keyboard shortcuts
- Right-click context menus
- Resizable panels

### Key Principles
- Clean, professional interface
- Fast local data access
- Intuitive workflow for workshop users
- Clear visual feedback for calculations
- Simple file management

## 💰 Business Model

### Annual Licensing
- **Standard License**: $299/year
  - Single workshop
  - All core features
  - Email support
  
- **Multi-Workshop**: $199/year per additional workshop
  - Volume discounts available
  - Centralized license management

### Website Requirements (Vercel)
- Landing page with feature overview
- Pricing page
- Stripe integration for payments
- License key generation and delivery
- Customer portal for renewals
- PWA download and installation guide

## 🚀 Iterative Implementation Roadmap

### 🔥 Critical Path Dependencies
1. **File System Access API** - Foundation for all local storage
2. **License Validation** - Gates feature access
3. **Basic Data Persistence** - CRUD operations for core entities
4. **PWA Installation** - Desktop app experience

### 📋 Sprint 1: Foundation (Week 1)
**Goal**: Establish core infrastructure and data persistence

**Stories:**
- [ ] **File System Access Implementation**
  - Directory picker for data storage location
  - JSON file read/write operations
  - Error handling for permissions
  - Fallback to localStorage for testing
- [ ] **License System Mock**
  - Basic license key validation (local)
  - License status UI components
  - Settings page with license entry
- [ ] **Navigation Shell**
  - Basic app layout with sidebar
  - Route structure (/materials, /quotes, /cutting, /jobs)
  - Empty state components
- [ ] **Data Layer Foundation**
  - Storage abstraction layer
  - Basic CRUD operations for JSON files
  - Data validation with Zod schemas

**Testing Strategy:**
- Unit tests for storage operations
- Mock File System Access API for CI/CD
- Manual testing in Chrome/Edge for real API
- Test directory picker and file permissions

**Success Criteria:**
- Can select data storage folder
- Can create/read/update JSON files
- App shell navigation works
- License mock validates properly

---

### 📋 Sprint 2: Materials & Settings (Week 2)  
**Goal**: Complete materials management and app settings

**Stories:**
- [ ] **Materials CRUD**
  - Add/edit/delete materials
  - Material categories and specifications
  - Cost per meter calculations
  - Active/inactive material toggle
- [ ] **Settings Management**
  - Workshop name, currency, tax rate
  - Default stock lengths and blade kerf
  - Data folder location display
  - Export/import data (ZIP functionality)
- [ ] **UI Components**
  - Forms with react-hook-form + Zod
  - Data tables with sorting/filtering
  - Confirmation dialogs
  - Toast notifications

**Testing Strategy:**
- Test materials CRUD operations
- Test data export/import ZIP files
- Validate form inputs and error states
- Test across different data folder locations

**Success Criteria:**
- Full materials management working
- Settings persist correctly
- Data export/import functions
- Responsive UI components

---

### 📋 Sprint 3: Quotes & Cutting (Week 3)
**Goal**: Core business logic and cutting optimization

**Stories:**
- [ ] **Quote Builder**
  - Customer information entry
  - Line items with descriptions/quantities
  - Material selection and usage calculation
  - Labor rate applications
  - Quote totals and tax calculation
- [ ] **Simple Cutting Optimizer**
  - Longest-first algorithm implementation
  - Stock piece management (new + existing)
  - Cut list generation with positions
  - Waste calculation and efficiency metrics
  - Visual cut list display
- [ ] **PDF Generation**
  - Professional quote PDF layout
  - Company branding integration
  - Cut list PDF for workshop use

**Testing Strategy:**
- Test cutting optimization with various scenarios
- Validate quote calculations accuracy
- Test PDF generation and layout
- Performance testing for large cut lists

**Success Criteria:**
- Can create complete quotes with cutting lists
- Cutting optimizer produces efficient results
- PDFs generate correctly with proper formatting
- Quote calculations are accurate

---

### 📋 Sprint 4: Jobs & Polish (Week 4)
**Goal**: Job management and production readiness

**Stories:**
- [ ] **Job Management**
  - Convert quotes to jobs
  - Job status tracking (pending/in-progress/completed)
  - Material allocation and usage tracking
  - Time logging (estimated vs actual)
  - Job notes and progress updates
- [ ] **Advanced Features**
  - Quote versioning and templates
  - Customer management
  - Data backup reminders
  - Keyboard shortcuts
- [ ] **Real License Integration**
  - Website API for license validation
  - Online/offline license checking
  - License renewal reminders
  - Error handling for invalid licenses

**Testing Strategy:**
- End-to-end workflow testing
- License validation testing
- Performance testing with large datasets
- Cross-browser PWA installation testing

**Success Criteria:**
- Complete quote-to-job workflow
- Real license system working
- App performs well with realistic data volumes
- PWA installs and works offline

---

### 📋 Sprint 5: Website & Deployment (Week 5)
**Goal**: Marketing website and license sales system

**Stories:**
- [ ] **Marketing Website**
  - Landing page with feature showcase
  - Pricing page with license options
  - Download and installation guide
  - Documentation and support pages
- [ ] **License Sales System**
  - Stripe integration for payments
  - License key generation
  - Customer portal for renewals
  - Email delivery system
- [ ] **Deployment Pipeline**
  - Vercel deployment for both apps
  - Environment configuration
  - Analytics and monitoring setup

## 🧪 Testing Strategy

### Local Development
```bash
# Mock File System Access for development
npm run dev:mock-fs

# Real File System Access testing
npm run dev:real-fs  # Chrome/Edge only
```

### Cross-Browser Testing
- **Primary**: Chrome/Edge (File System Access API)
- **Secondary**: Firefox/Safari (localStorage fallback)
- **Mobile**: Basic responsive testing (not primary target)

### Data Persistence Testing
```typescript
// Test data scenarios
const testScenarios = [
  'Empty data folder',
  'Existing data migration', 
  'Corrupted JSON recovery',
  'Permission denied handling',
  'Large dataset performance',
  'Offline operation',
];
```

### License Testing
```typescript
// License test cases
const licenseTests = [
  'Valid active license',
  'Expired license',
  'Invalid license key',
  'Network offline validation',
  'License renewal flow',
];
```

## 🔄 Development Workflow

### Daily Process
1. **Morning**: Review previous day's progress
2. **Implementation**: Focus on current sprint stories
3. **Testing**: Manual test in target browsers
4. **Evening**: Update progress and plan next day

### Sprint Reviews
- **Demo**: Working features in Chrome/Edge
- **Retrospective**: What worked/didn't work
- **Planning**: Adjust next sprint based on learnings

### Risk Mitigation
- **File System API**: Always have localStorage fallback
- **License System**: Mock system allows development to continue
- **Browser Support**: Focus on Chrome/Edge primarily
- **Performance**: Profile with realistic workshop data volumes

## 🧪 Unit Tests
- Cutting optimizer algorithms
- Quote calculations  
- PDF generation
- Data validation

### Integration Tests
- File system operations
- License validation
- End-to-end workflows

### Manual Testing
- Cross-browser PWA installation
- File system permissions
- Offline functionality
- PDF output quality

## 📦 Deployment

### PWA Deployment (Vercel)
```json
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/]
});

module.exports = withPWA({
  experimental: {
    appDir: true,
  }
});
```

### Environment Variables
```env
# Website (.env.local)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://... # For license management
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com

# Desktop App
NEXT_PUBLIC_LICENSE_API_URL=https://your-domain.com/api
```

## 🔄 Data Backup & Sync

### User-Controlled Sync
1. User selects storage folder (OneDrive, Google Drive, etc.)
2. App saves all data as JSON files
3. Cloud service syncs files automatically
4. Multiple devices can access same data folder
5. User owns and controls all data

### Backup System
```typescript
// Simple ZIP backup
function exportData(): Promise<Blob> {
  const files = [
    'materials.json',
    'quotes.json', 
    'jobs.json',
    'rates.json',
    'settings.json'
  ];
  
  return createZip(files);
}

function importData(zipFile: File): Promise<void> {
  return extractAndRestore(zipFile);
}
```

## 📊 Success Metrics

### Technical Metrics
- App startup time < 2 seconds
- File operations < 500ms
- PDF generation < 5 seconds
- Cutting optimization < 1 second for typical jobs

### Business Metrics
- License conversion rate
- Annual renewal rate
- Customer satisfaction scores
- Feature usage analytics (anonymized)

## 🤝 Contributing

This is a commercial project. Internal development guidelines:

1. Follow TypeScript strict mode
2. Use conventional commits
3. Test cutting optimizer edge cases
4. Validate all PDF outputs
5. Test cross-browser PWA installation

## 📄 License

Commercial software. All rights reserved.

## 🆘 Support

- Documentation: [your-domain.com/docs](https://your-domain.com/docs)
- Email Support: support@your-domain.com
- License Issues: licenses@your-domain.com

---

**Built for workshops that build things** 🔧⚙️🏭