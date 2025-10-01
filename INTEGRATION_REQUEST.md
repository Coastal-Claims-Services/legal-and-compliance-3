# Integration Request for Talha

## Add Unified Compliance & Legal Hub to Employee Portal

### Summary
Please add the unified **Compliance & Legal Hub** to the CCS Employee Portal under a new tab named **"Compliance and Legal Hub"**.

---

## What This Includes

### Consolidated System
This consolidates 3 separate repositories into one unified system:
- ✅ ftdcad/compliance-and-legal-hub
- ✅ ftdcad/compliance-legal-2 (archived)
- ✅ ftdcad/ai-state-compliance (archived)

---

## Major Changes

### Backend Infrastructure
- ✅ Removed all Supabase dependencies
- ✅ Added MongoDB/NoSQL database with full Express backend
- ✅ **8 MongoDB models:**
  - ComplianceRule
  - ComplianceTemplate
  - ComplianceAlert
  - ComplianceState
  - ComplianceChatHistory
  - License
  - Bond
  - User

- ✅ **4 API route files with full CRUD operations:**
  - `/api/compliance` - Rules, templates, alerts, states, chat, stats
  - `/api/licenses` - Employee license tracking
  - `/api/bonds` - Employee bond tracking
  - `/api/auth` - JWT authentication

- ✅ JWT authentication middleware

### Frontend - ComplianceLegalHub Component

**Employee Compliance View:**
- Track adjuster licenses by state and employee
- Track bonds by state and employee
- Expiration status tracking with color-coding:
  - 🟢 Active (90+ days remaining)
  - 🟡 Expiring Soon (≤30 days)
  - 🔴 Expired
- Group licenses/bonds by employee
- State filtering dropdown

**Additional Views:**
- Company Compliance View (placeholder for corporate tracking)
- Dashboard with compliance metrics
- State browsing functionality
- Search rules interface
- Compare states feature
- Coastal Admin panel for managing rules, templates, and settings

**UI/UX:**
- Dark mode compatible
- Radix UI components
- Color-coded expiration status indicators
- State filtering dropdowns
- Responsive design

---

## Integration Steps for Talha

### Step 1: Copy Files to Employee Portal

Copy these files from `compliance-and-legal-hub` to `coastalclaims-employee-portal`:

**Frontend:**
```
src/pages/ComplianceLegalHub.tsx → src/pages/ComplianceLegalHub.tsx
```

**Backend (if not already present):**
```
server/src/models/ComplianceRule.ts
server/src/models/ComplianceTemplate.ts
server/src/models/ComplianceAlert.ts
server/src/models/ComplianceState.ts
server/src/models/ComplianceChatHistory.ts
server/src/routes/compliance.ts
```

### Step 2: Update Employee Portal Navigation

In `src/components/Layout.tsx`, add this menu item in the admin section:

```typescript
{ path: '/admin/compliance-legal-hub', name: 'Compliance & Legal Hub', icon: <Gavel size={20} /> }
```

### Step 3: Update Employee Portal Routing

In `src/components/AdminRouter.tsx`, add this route:

```typescript
<Route path="/admin/compliance-legal-hub" element={<ComplianceLegalHub />} />
```

Don't forget the import:
```typescript
import ComplianceLegalHub from '@/pages/ComplianceLegalHub';
```

### Step 4: Register Backend Routes (if needed)

In `server/src/index.ts`, ensure these routes are registered:

```typescript
import complianceRoutes from './routes/compliance';
app.use('/api/compliance', complianceRoutes);
```

### Step 5: Database Setup

The system uses MongoDB. If using the existing employee portal database:
- Models will auto-create collections on first use
- Database name: `coastal-claims-portal` (or whatever is in your .env)

If you want a separate database:
- Update MONGO_URI in server/.env to point to `legal-compliance-3` database

---

## Files Changed in compliance-and-legal-hub Repo

- **30 files changed**, 11,603 insertions(+), 2,704 deletions(-)
- **New:** `src/pages/ComplianceLegalHub.tsx` (~1350 lines)
- **New:** Complete server infrastructure in `/server` directory
- **Updated:** `src/App.tsx` to route to ComplianceLegalHub
- **Removed:** All Supabase integrations

---

## Test Plan

After integration, please verify:

- [ ] MongoDB connection is working
- [ ] Employee Compliance View displays with state filtering
- [ ] Licenses and bonds display correctly grouped by employee
- [ ] Expiration status color-coding works (Active/Expiring Soon/Expired)
- [ ] All API endpoints respond correctly:
  - GET `/api/compliance/rules`
  - GET `/api/compliance/states`
  - GET `/api/licenses`
  - GET `/api/bonds`
- [ ] Authentication works (JWT tokens)
- [ ] Dark mode styling is correct
- [ ] Navigation to/from the hub works
- [ ] No console errors

---

## Important Notes

⚠️ **Environment Variables:**
- The `.env` file is NOT committed to the repo
- You'll need to ensure MongoDB connection string is set
- Backend runs on port 4000, frontend on 5173

⚠️ **Database:**
- Can use existing employee portal database
- Or create separate `legal-compliance-3` database
- Models will auto-create collections

⚠️ **Dependencies:**
- All dependencies are already in package.json
- Run `npm install` in both root and server directories

---

## Repository Links

**Main Repo (Active):**
- https://github.com/Coastal-Claims-Services/compliance-and-legal-hub

**Archived Repos (Old - DO NOT USE):**
- https://github.com/Coastal-Claims-Services/compliance-legal-2
- https://github.com/ftdcad/ai-state-compliance

---

## Questions?

If you have any questions about the integration, please reach out!

**Priority:** High - This consolidates 3 separate systems into one unified hub

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
