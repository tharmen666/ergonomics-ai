# 📚 IRIS CORE DATA - File Index

## Navigation Guide for Frontend Developers

---

## 🚀 **START HERE**

### 1. **DELIVERY_SUMMARY.md** ⭐ READ FIRST
**What**: Executive summary of everything delivered  
**Who**: Decision makers, project managers, frontend leads  
**Time**: 5 minutes  
**Contains**: Deliverables, inventory, production checklist, achievements

👉 **READ THIS FIRST** to understand what you have.

---

### 2. **QUICK_START.md** 🎯 INTEGRATION GUIDE
**What**: 5-minute integration cookbook  
**Who**: Frontend developers implementing features  
**Time**: 5 minutes  
**Contains**: Code examples, patterns, testing checklist, performance specs

👉 **READ THIS NEXT** to start using the data.

---

## 📖 **REFERENCE DOCUMENTATION**

### 3. **IRIS_DATABASE_README.md** 📋 FULL REFERENCE
**What**: Complete technical documentation  
**Who**: Developers, architects, technical leads  
**Time**: 15-20 minutes  
**Contains**: Schema overview, language support, API design, validation

👉 **USE THIS** when you need detailed information.

---

## 💾 **DATA & TYPES**

### 4. **irisCore.json** 📊 MASTER DATABASE
**What**: Complete production database (JSON)  
**Size**: ~20KB  
**Format**: Production-ready JSON  
**Contents**:
- Metadata (version, status, build date)
- Iris personality profile
- 3 Emergency SOPs (Side A)
- 3 Service SOPs (Side B)
- 5 FAQ cards (Astron transition deck)
- Frontend integration metadata

**Access Pattern**: 
```typescript
import irisData from './irisCore.json';
```

---

### 5. **irisSchema.ts** 🏗️ TYPE DEFINITIONS
**What**: Complete TypeScript interfaces  
**Size**: ~3.6KB  
**Contains**:
- BilingualContent interface
- SOPTrack, SOPStep structures
- FAQCard definition
- IrisCoreDatabase root type
- Runtime validators (type guards)
- Utility types and helpers

**Use Pattern**:
```typescript
import type { SOPTrack, FAQCard, BilingualContent } from './irisSchema';
```

---

## 🔧 **IMPLEMENTATION FILES**

### 6. **irisDataLoader.ts** ⚙️ DATA MANAGER (CORE)
**What**: High-performance singleton data manager  
**Size**: ~6KB  
**Key Features**:
- O(1) SOP lookup by ID
- O(1) FAQ lookup by card number
- Search functionality
- Bilingual content handling
- Export capabilities
- Cache metadata

**Primary Methods**:
```typescript
getSOP(id: string): SOPTrack
getFAQCard(cardNumber: number): FAQCard
getAllSOPs(): SOPTrack[]
getFAQDeck(): FAQCard[]
getLocalizedText(content, locale)
searchSOPs(keyword, locale)
```

**Import Pattern**:
```typescript
import { getIrisCoreDataManager } from './irisDataLoader';
const iris = getIrisCoreDataManager();
```

---

### 7. **useIrisCore.ts** ⚛️ REACT HOOKS (FOR COMPONENTS)
**What**: 16 purpose-built React hooks  
**Size**: ~7.6KB  
**Hooks Available**:

**Core Data Hooks**:
- `useSOPById(sopId)` - Get single SOP
- `useFAQCard(cardNumber)` - Get single FAQ
- `useAllSOPs()` - Get all SOPs
- `useFAQDeck()` - Get all FAQ cards

**Filter & Search**:
- `useSOPsByPriority(priority)` - Filter by priority
- `useSearchSOPs(keyword, locale)` - Search
- `useCriticalSOPs()` - Emergency only

**Localization**:
- `useLocalePreference(default)` - Language switching with storage
- `useLocalizedIrisContent(locale)` - All content in a language
- `useLocalizedSOP(id, locale)` - SOP in specific language
- `useLocalizedFAQCard(cardNumber, locale)` - FAQ in specific language
- `useLocalizedFAQDeck(locale)` - Full deck in specific language

**Utility**:
- `useIrisPersonality()` - Iris profile
- `useIrisMetadata()` - Database metadata
- `useIrisReady()` - Status & cache info
- `useAllLocalizedSOPs(locale)` - Combined SOPs in locale

**Import Pattern**:
```typescript
import { useAllSOPs, useFAQDeck, useLocalePreference } from './useIrisCore';
```

---

### 8. **lanyardMatrix.ts** 📋 LEGACY REFERENCE
**What**: Original TypeScript SOP definitions  
**Status**: Keep for reference/migration  
**Note**: New primary source is irisCore.json

---

## 📚 **QUICK LOOKUP**

### By Role

**Frontend Developer**:
1. Start: DELIVERY_SUMMARY.md
2. Next: QUICK_START.md
3. Code: useIrisCore.ts (React hooks)
4. Reference: IRIS_DATABASE_README.md

**TypeScript Developer**:
1. Start: irisSchema.ts (types)
2. Implementation: irisDataLoader.ts (manager)
3. Integration: useIrisCore.ts (if React)
4. Reference: IRIS_DATABASE_README.md

**React Developer**:
1. Start: QUICK_START.md
2. Hooks: useIrisCore.ts (16 available)
3. Data: irisDataLoader.ts (if needed)
4. Types: irisSchema.ts (for props/state)

**Project Manager**:
1. Overview: DELIVERY_SUMMARY.md
2. Status: "LOCKED_FOR_FRONTEND" ✅
3. Inventory: 6 SOPs + 5 FAQ cards
4. Languages: English + isiZulu

**Architect**:
1. Schema: IRIS_DATABASE_README.md
2. API Design: API Endpoints section
3. Performance: Performance section
4. Types: irisSchema.ts

---

## 🎯 **Content Inventory Quick Reference**

### Emergency SOPs (3)
- SOP-EVAC-01: Instant Forecourt Evacuation (CRITICAL)
- SOP-SPILL-02: HazMat Spill Containment (HIGH)
- SOP-FIRE-03: Minor Fire Suppression (CRITICAL)

### Service SOPs (3)
- SOP-CUST-01: 6-Point Pump Service Routine (HIGH)
- SOP-PAY-02: Secure Payment Processing (MEDIUM)
- SOP-CLEA-03: End-of-Shift Cleanup & Security (MEDIUM)

### FAQ Cards (5)
1. Brand transition (Caltex → Astron)
2. Fuel quality assurance
3. UCount Rewards compatibility
4. Fleet card acceptance
5. FreshStop upgrade

### Languages
- English (en)
- isiZulu (zu)

---

## 📋 **Integration Checklist**

Before going to production:

- [ ] Read DELIVERY_SUMMARY.md
- [ ] Read QUICK_START.md
- [ ] Verify irisCore.json loads
- [ ] Test all React hooks
- [ ] Implement locale switching (en/zu)
- [ ] Display all 6 SOPs
- [ ] Display FAQ deck (5 cards)
- [ ] Test bilingual rendering
- [ ] Verify Iris personality in UI
- [ ] Check performance (target <100ms)
- [ ] Validate API endpoints connect
- [ ] Test on all supported screens

---

## 🚀 **Ready to Deploy**

**Status**: ✅ PRODUCTION READY  
**Version**: 2026.5.1-PRODUCTION  
**Database**: LOCKED_FOR_FRONTEND  
**Bilingual**: English + isiZulu  
**Type Safety**: 100% TypeScript  
**Performance**: Optimized for <50ms load  

---

## 📞 **Quick Reference**

| Question | Answer | File |
|---|---|---|
| What did I get? | 8 files totaling ~44KB | DELIVERY_SUMMARY.md |
| How do I use it? | 5-minute guide | QUICK_START.md |
| What's inside? | 6 SOPs + 5 FAQ cards | IRIS_DATABASE_README.md |
| How to fetch data? | Use getIrisCoreDataManager() | irisDataLoader.ts |
| React components? | 16 hooks available | useIrisCore.ts |
| Type safety? | Full TypeScript support | irisSchema.ts |
| Performance? | <50ms, O(1) lookups | IRIS_DATABASE_README.md |
| Bilingual? | English + isiZulu | All files |

---

## 🎭 **About Iris**

**Name**: Iris  
**Role**: Safety Agent  
**Personality**: Authoritative, supportive, action-oriented  
**Languages**: English + isiZulu  
**Mission**: Ensure safety at Astron Energy forecourts  
**Voice**: Consistent, protective, empowering  

---

**Last Updated**: 2026-05-28  
**Status**: ✅ PRODUCTION LOCKED  
**Ready**: YES ✅

*"Your life is the primary asset. Speed plus safety. Consistency builds culture. Prevention is always superior to reaction."* - Iris
