# Getting Started - Sprint 1 

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd Workshop-Quotation-PWA
npm run setup
```

### 2. Start Development
```bash
# Desktop app (our main focus)
npm run dev:app

# Should open on http://localhost:3001
# Chrome or Edge required for File System Access API
```

### 3. Verify Setup
- [ ] App loads in browser
- [ ] No console errors
- [ ] Basic routing works
- [ ] Tailwind styles load correctly

## 🎯 Sprint 1 Checklist

### ✅ Week 1 - Day 1: File System Access - COMPLETED
- [x] Research File System Access API docs
- [x] Create `src/lib/storage/FileSystemAdapter.ts`
- [x] Create `src/lib/storage/LocalStorageAdapter.ts` 
- [x] Implement directory picker button
- [x] Test in Chrome/Edge with real directories
- [x] Implement fallback detection
- [x] Fix IndexedDB and SSR compatibility issues
- [x] Create interactive test interface

**Success Criteria**: ✅ Can pick a folder and write a test JSON file

---

### ✅ Week 1 - Day 2: Data Layer Foundation - COMPLETED
- [x] Create `src/lib/data/BaseDataService.ts` 
- [x] Add comprehensive Zod schemas for all entities
- [x] Implement full CRUD operations with validation
- [x] Add error handling and data integrity checks
- [x] Create Materials and Settings services
- [x] Build interactive test interface

**Success Criteria**: ✅ Can save/load all data types reliably with validation

---

### Week 1 - Day 3: App Navigation Shell
- [ ] Create `src/components/layout/AppLayout.tsx`
- [ ] Add sidebar navigation component
- [ ] Set up route structure with Next.js App Router
- [ ] Create placeholder pages for each section
- [ ] Add responsive navigation for desktop
- [ ] Style with Tailwind + shadcn/ui

**Success Criteria**: Navigation between all main sections works

---

### Week 1 - Day 4: License System Mock
- [ ] Create `src/lib/license/LicenseManager.ts`
- [ ] Add license validation logic (mock)
- [ ] Create license entry form component
- [ ] Add license status indicators
- [ ] Implement feature gating hook
- [ ] Add license expiry warnings

**Success Criteria**: Mock license gates access to features

---

### Week 1 - Day 5: Integration & Testing
- [ ] End-to-end workflow: folder → data → license → UI
- [ ] Cross-browser testing (Chrome, Edge, Firefox fallback)
- [ ] Error handling and user experience polish
- [ ] Performance testing with sample data
- [ ] Deploy to Vercel for testing
- [ ] Document any blockers or issues

**Success Criteria**: Complete foundation ready for Sprint 2

## 🧪 Testing Commands

```bash
# Run all tests
npm run test:unit

# Type checking
npm run type-check

# Linting
npm run lint

# Build check
npm run build:app
```

## 🔧 Development Tips

### File System Access API
```typescript
// Feature detection
if ('showDirectoryPicker' in window) {
  // Use real API (Chrome/Edge)
} else {
  // Use localStorage fallback (Firefox/Safari)
}
```

### Chrome DevTools
- **Application** tab → **Storage** → Check File System Access permissions
- **Console** tab → Monitor for any errors
- **Network** tab → Check API requests

### Common Gotchas
- File System Access only works on **HTTPS** or **localhost**
- Must be **Chrome 86+** or **Edge 86+** for full features
- Directory picker requires **user gesture** (button click)
- JSON files should have atomic writes to prevent corruption
- No service workers - app runs directly in browser

## 🎯 Success Metrics

By end of Sprint 1, you should have:

1. **Working local storage** via File System Access API
2. **Basic app navigation** between all main sections  
3. **Mock license system** that gates features
4. **Data persistence** for at least one entity (materials)
5. **Error handling** for common failure cases
6. **Cross-browser support** with fallbacks

## 🚫 Scope Boundaries

**IN SCOPE** for Sprint 1:
- ✅ Basic storage abstraction
- ✅ Simple data CRUD
- ✅ App navigation shell
- ✅ Mock license validation

**OUT OF SCOPE** for Sprint 1:
- ❌ Materials UI/forms (Sprint 2)
- ❌ Quote builder (Sprint 3)  
- ❌ Cutting optimization (Sprint 3)
- ❌ PDF generation (Sprint 3)
- ❌ Real license API (Sprint 4)

## 🐛 Troubleshooting

### File System Access Not Working
1. Check browser version (Chrome 86+ or Edge 86+)
2. Ensure you're on `localhost` or `https://`
3. Check browser console for permission errors
4. Try incognito mode to rule out extensions

### Build Errors
```bash
# Clean and rebuild
npm run clean
npm run setup
npm run build:app
```

### TypeScript Errors
```bash
# Check types across all packages
npm run type-check
```

### Module Resolution Issues
- Check `tsconfig.json` path mapping
- Verify `@workshop/shared` package is built
- Clear `.next` cache: `rm -rf apps/desktop-app/.next`

---

**Ready to start Sprint 1?** 🚀

Next step: Start with Day 1 - File System Access API implementation!