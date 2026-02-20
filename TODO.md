# Dashboard Enhancement TODO

## Phase 1: Loading & Error Components
- [x] Create `app/dashboard/loading.tsx` - Loading component with skeleton UI
- [x] Create `app/dashboard/error.tsx` - Error boundary component

## Phase 2: Role-based Dashboard
- [x] Create role types in `app/utils/type.ts`
- [x] Create `app/dashboard/components/` directory with:
  - [x] `RoleGuard.tsx` - Role detection/protection component
  - [x] `AdminDashboard.tsx` - Admin view with full access
  - [x] `ManagerDashboard.tsx` - Manager view with team overview
  - [x] `UserDashboard.tsx` - User view for tickets

## Phase 3: Update Dashboard Pages
- [x] Update `app/dashboard/page.tsx` - Main dashboard with role routing
- [ ] Update `app/dashboard/layout.tsx` - Add role selector navigation (Optional)
