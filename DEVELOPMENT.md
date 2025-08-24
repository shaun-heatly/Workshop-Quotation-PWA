# Development Guide - Sprint 1

## 🚀 Sprint 1 Implementation Plan

### ✅ Day 1: File System Access API Foundation - COMPLETED

**Status: SUCCESS** - All tests passed

#### ✅ Completed Implementation:
1. **Storage abstraction layer** - `src/lib/storage/`
   - `FileSystemAdapter` - Real File System Access API 
   - `LocalStorageAdapter` - Cross-browser fallback
   - `StorageManager` - Unified interface with auto-detection

2. **File System Access API** - Chrome/Edge support
   - Directory picker with folder selection
   - JSON file read/write/delete operations
   - IndexedDB persistence for directory handles
   - Permission validation and error handling

3. **Cross-browser fallback** - localStorage for Firefox/Safari
   - Automatic browser detection
   - Graceful degradation
   - Same interface across all browsers

#### ✅ Testing Results:
- ✅ Manual testing in Chrome/Edge - File System Access working
- ✅ Cross-browser fallback tested - localStorage working  
- ✅ SSR compatibility - No hydration errors
- ✅ Error handling - Graceful failure recovery
- ✅ Live test interface - Interactive validation component

#### ✅ Issues Fixed:
- Fixed IndexedDB object store creation race condition
- Fixed SSR hydration mismatch errors  
- Fixed StorageManager multiple adapter instance bug
- Added proper browser compatibility detection

**Foundation is rock-solid and ready for Day 2!**

---

### Day 2: Basic Data Layer

**Priority: HIGH** - Needed for all CRUD operations

#### Tasks:
1. **Create data service layer**
   ```typescript
   // src/lib/data/DataService.ts
   class DataService {
     constructor(private storage: StorageAdapter) {}
     
     async getMaterials(): Promise<Material[]>
     async saveMaterial(material: Material): Promise<void>
     async deleteMaterial(id: string): Promise<void>
   }
   ```

2. **Add Zod validation**
   ```typescript
   // Ensure data integrity for JSON files
   const MaterialSchema = z.object({
     id: z.string(),
     name: z.string().min(1),
     // ... other fields
   });
   ```

3. **Error handling and recovery**
   ```typescript
   // Handle corrupted JSON files
   // Provide data migration paths
   ```

#### Testing:
- Test with empty data folder
- Test with existing data
- Test corruption recovery
- Validate schema enforcement

---

### Day 3: App Shell and Navigation

**Priority: MEDIUM** - UI foundation

#### Tasks:
1. **Create main layout**
   ```typescript
   // src/components/layout/AppLayout.tsx
   // Sidebar navigation
   // Main content area
   // Header with settings
   ```

2. **Route structure**
   ```
   /materials - Materials management
   /quotes - Quote builder
   /cutting - Cutting optimizer
   /jobs - Job tracking
   /settings - App settings
   ```

3. **Empty state components**
   ```typescript
   // Show helpful messages when no data exists
   // Guide users through first-time setup
   ```

#### Testing:
- Navigation works correctly
- Routes render properly
- Responsive design basics

---

### Day 4: License System Mock

**Priority: HIGH** - Gates feature access

#### Tasks:
1. **License validation logic**
   ```typescript
   // src/lib/license/LicenseManager.ts
   class LicenseManager {
     async validateLicense(key: string): Promise<LicenseValidation>
     async storeLicense(license: License): Promise<void>
     isLicenseValid(): boolean
     getDaysUntilExpiry(): number
   }
   ```

2. **License UI components**
   ```typescript
   // License entry form
   // License status display
   // Renewal reminders
   ```

3. **Feature gating**
   ```typescript
   // Hook to check license before enabling features
   const useLicenseGate = (feature: string) => boolean;
   ```

#### Testing:
- Test various license key formats
- Test expiry date calculations
- Test feature gating logic

---

### Day 5: Integration and Testing

**Priority: CRITICAL** - Ensure everything works together

#### Tasks:
1. **End-to-end testing**
   - Directory selection → data storage → UI updates
   - License entry → validation → feature access

2. **Error handling polish**
   - User-friendly error messages
   - Recovery suggestions
   - Graceful degradation

3. **Performance baseline**
   - Measure file I/O performance
   - Test with larger datasets
   - Memory usage profiling

## 🛠️ Development Setup

### Prerequisites
```bash
# Install dependencies
cd Workshop-Quotation-PWA
npm install

# Start desktop app
npm run dev:app

# Start website (later)
npm run dev:website
```

### Browser Requirements
- **Chrome 86+** or **Edge 86+** for File System Access API
- **Firefox/Safari** will use localStorage fallback (limited functionality)

### Development Environment
```bash
# Environment variables for desktop app
NEXT_PUBLIC_ENABLE_FILE_SYSTEM_ACCESS=true
NEXT_PUBLIC_LICENSE_API_URL=http://localhost:3000/api

# Mock license for development
NEXT_PUBLIC_MOCK_LICENSE_KEY=WQ2024-MOCK-TEST-KEY1
```

## 🔧 Key Technical Decisions

### 1. File System Access API Strategy
- **Primary**: Use File System Access API when available
- **Fallback**: localStorage with limited functionality
- **Migration**: Provide export/import between storage types

### 2. Data Structure
```
UserSelectedFolder/
├── materials.json
├── quotes.json
├── jobs.json
├── rates.json
├── settings.json
└── license.json (encrypted)
```

### 3. License Strategy
- **Development**: Mock validation for rapid development
- **Testing**: Temporary licenses for QA
- **Production**: Real API validation with offline caching

### 4. Error Recovery
- **Corrupted JSON**: Backup previous version, offer recovery
- **Permission Issues**: Clear instructions, fallback options
- **Network Issues**: Graceful degradation, offline mode

## 📊 Success Metrics for Sprint 1

### Must Have ✅
- [ ] Can select data storage directory (Chrome/Edge)
- [ ] Can create/read/write JSON files
- [ ] Basic app navigation works
- [ ] License mock validation functional
- [ ] localStorage fallback works for development

### Should Have 📈
- [ ] Error handling covers common scenarios
- [ ] UI is responsive and accessible
- [ ] Performance is acceptable (< 500ms for file ops)
- [ ] Data validation prevents corruption

### Could Have 🎯
- [ ] Keyboard shortcuts for navigation
- [ ] Dark mode theme
- [ ] Data folder location display in settings
- [ ] Basic analytics/usage tracking

## 🚫 What NOT to Build Yet

### Avoid Feature Creep
- ❌ Complex cutting optimization (Sprint 3)
- ❌ PDF generation (Sprint 3)  
- ❌ Real license API integration (Sprint 4)
- ❌ Job management (Sprint 4)
- ❌ Advanced UI polish (Sprint 4)

### Focus on Foundation
- ✅ Storage abstraction that works
- ✅ Basic data CRUD operations
- ✅ License validation framework
- ✅ Navigation shell
- ✅ Error handling patterns

## 🔄 Daily Standup Questions

1. **Yesterday**: What did I complete?
2. **Today**: What will I work on?
3. **Blockers**: What's preventing progress?
4. **Testing**: How did I validate the work?
5. **Risk**: Any concerns about the approach?

## 🐛 Common Issues and Solutions

### File System Access Not Working
- Check Chrome/Edge version (86+)
- Ensure HTTPS or localhost
- Check browser permissions
- Test with simple directory picker example

### JSON Files Corrupted
- Always backup before writing
- Use atomic writes when possible
- Implement schema validation
- Provide manual recovery options

### License Validation Issues  
- Start with simple mock system
- Test various key formats
- Handle expiry edge cases
- Plan for offline validation

---

**Remember**: Sprint 1 is about proving the core concept works. Focus on the foundation, not the features!