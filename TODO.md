# AfriDam AI App - Tier Implementation & Feature Locks

## Overview
Implement tier-based feature locking system with default "Free Tier" for new users, lock premium features, and fix backend API issues.

## Tasks

### ✅ Completed
- [x] Analyze existing codebase and tier configuration
- [x] Identify feature lock components and subscription API
- [x] Understand backend API integration requirements

### 🔄 In Progress
- [ ] Update auth provider to assign 'free' tier during registration
- [ ] Implement skin diary lock (hide additional info after AI scan for free users)
- [ ] Add ingredient analyzer history lock with pricing page redirect
- [ ] Fix backend API endpoint for user profile (/api/users/me/)
- [ ] Test all feature locks and ensure proper functionality

### 📋 Pending
- [ ] Update scan results component to hide details for free users
- [ ] Add pricing gate redirect for ingredient analyzer history
- [ ] Verify backend API fixes work correctly
- [ ] Test complete user flow from registration to feature access

## Technical Details

### Files to Modify
- `providers/auth-provider.tsx` - Add default tier assignment
- `components/scan-results.tsx` - Implement skin diary lock
- `components/ingredient-analyzer.tsx` - Add history lock
- `lib/api-client.ts` - Fix backend API endpoint
- `app/api/user/route.ts` - Update user API endpoint

### Backend API Fixes
- Endpoint: `/api/users/me/`
- Postman Link: https://go.postman.co/workspace/8f4b994d-aa39-4731-a7ce-b2b5761301c4/request/45401771-7a5bfec8-0189-429e-9253-32a9d04a03ed

### Feature Locks Required
- Skin Diary: Hide additional info after AI scan for free users
- Screenshots: Already implemented
- Downloads: Already implemented
- Sharing: Already implemented
- Ingredient Analyzer History: Redirect to pricing page for free users

## Testing Checklist
- [ ] New user registration assigns 'free' tier
- [ ] Free users cannot access skin diary details
- [ ] Free users redirected to pricing for ingredient history
- [ ] Premium features properly locked
- [ ] Backend API calls work correctly
