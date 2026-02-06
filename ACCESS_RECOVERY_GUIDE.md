# Access Recovery Implementation Guide

## Overview

The Access Recovery flow provides an alternative account recovery method using saved recovery codes. This complements the standard password reset flow via email.

## Complete Access Recovery Flow

```
┌─────────────────────────────────────────────┐
│ LOGIN PAGE (/login)                         │
│ (Add link: "Access Recovery")               │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ ENTER RECOVERY CODE PAGE                    │
│ (/recover-access)                           │
│ - Input recovery code field                 │
│ - Orange accent (#E1784F)                   │
│ - Shield icon                               │
│ - Button: "VERIFY RECOVERY CODE"            │
└────────────┬────────────────────────────────┘
             │
             │ Code verified
             │
             ▼
┌─────────────────────────────────────────────┐
│ SET NEW PASSWORD PAGE                       │
│ (/recover-access/new-password)             │
│ - New password input (show/hide)            │
│ - Confirm password input (show/hide)        │
│ - Teal accent (#4DB6AC)                     │
│ - Lock icon                                 │
│ - Button: "RESET PASSWORD"                  │
└────────────┬────────────────────────────────┘
             │
             │ Password reset via API
             │
             ▼
┌─────────────────────────────────────────────┐
│ LOGIN PAGE (/login)                         │
│ - User can now login with new password      │
└─────────────────────────────────────────────┘
```

## Pages Created

### 1. Access Recovery Code Page
**Path:** `/recover-access`
**File:** `app/(auth)/recover-access/page.tsx`

Features:
- Shield icon with orange accent
- Recovery code input field (copy-paste friendly)
- Client-side validation (minimum 6 characters)
- Success/error messaging
- Automatic redirect to password set page
- Back to login link
- Dark mode support

### 2. Recovery New Password Page
**Path:** `/recover-access/new-password`
**File:** `app/(auth)/recover-access/new-password/page.tsx`

Features:
- Lock icon with teal accent
- New password input with show/hide toggle
- Confirm password input with show/hide toggle
- Password strength validation (8+ characters)
- Password matching validation
- Calls `POST /api/auth/reset-password` with token
- Auto-redirect to login on success
- Back to recovery code page link
- Dark mode support

## Reusable Form Components

### AccessRecoveryCodeForm
**Path:** `components/access-recovery-code-form.tsx`
**Purpose:** Standalone form component for recovery code input

Usage:
```tsx
import { AccessRecoveryCodeForm } from "@/components/access-recovery-code-form"

<AccessRecoveryCodeForm 
  onSuccess={() => handleSuccess()}
  onCancel={() => handleCancel()}
/>
```

Props:
- `onSuccess?: () => void` - Callback when code is verified
- `onCancel?: () => void` - Callback when user cancels

### RecoveryPasswordForm
**Path:** `components/recovery-password-form.tsx`
**Purpose:** Standalone form component for setting new password during recovery

Usage:
```tsx
import { RecoveryPasswordForm } from "@/components/recovery-password-form"

<RecoveryPasswordForm 
  token="recovery-code"
  onSuccess={() => router.push("/login")}
  onCancel={() => handleCancel()}
/>
```

Props:
- `token: string` (required) - Recovery code/token from previous step
- `onSuccess?: () => void` - Callback after password reset
- `onCancel?: () => void` - Callback when user cancels

## API Integration

### POST `/api/auth/reset-password`
```json
{
  "token": "recovery-code-from-user",
  "newPassword": "NewSecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## File Structure

```
app/(auth)/
└── recover-access/
    ├── page.tsx              [Recovery code input page]
    └── new-password/
        └── page.tsx          [New password set page]

components/
├── access-recovery-code-form.tsx    [Reusable code form]
└── recovery-password-form.tsx       [Reusable password form]
```

## Validation Rules

| Page | Field | Rules |
|------|-------|-------|
| Recovery Code | Recovery Code | Required, min 6 chars |
| Set Password | Password | Required, min 8 chars |
| Set Password | Confirm | Required, must match |

## Error Scenarios

### Recovery Code Page Errors
- Empty code → "Please enter your Access Recovery code."
- Code too short → "Recovery code must be at least 6 characters long."
- Backend error → Displays backend error message
- Network error → Connection failure message

### Password Page Errors
- Missing token → "Invalid recovery code. Please go back and verify your code again."
- Empty fields → "Please fill in all fields."
- Password too short → "Password must be at least 8 characters long."
- Passwords don't match → "Passwords do not match."
- API error → "Failed to reset password. Your recovery code may be invalid or expired."

## Success Messages

✅ **Recovery Code Verified**
- "Recovery code verified! Redirecting..."
- Auto-navigates to new password page

✅ **Password Reset Complete**
- "Password reset successfully! Redirecting to login..."
- Auto-navigates to login page after 2 seconds

## Styling Consistency

- **Recovery Code Page**: Orange accent (#E1784F), Shield icon
- **Password Page**: Teal accent (#4DB6AC), Lock icon
- **Animations**: Smooth Framer Motion transitions
- **Layout**: Centered, responsive, full-screen
- **Dark Mode**: Fully supported
- **Gradient**: Decorative blur backgrounds

## Security Considerations

1. **Token Validation**
   - Backend should validate token before allowing password reset
   - Tokens should be one-time use (backend responsibility)
   - Tokens should expire after set duration (backend responsibility)

2. **Password Security**
   - Minimum 8 characters enforced
   - Show/hide toggle for visibility
   - Confirmation field to prevent typos
   - Client-side validation before submission

3. **Rate Limiting**
   - Backend should implement rate limiting
   - Prevent brute force attempts on recovery codes
   - Prevent multiple password reset attempts

4. **Recovery Code Storage**
   - Users should save recovery code during account setup
   - Recovery codes should be invalidated after successful use
   - Consider implementing multiple recovery codes per user

## Integration Steps

1. **Add Login Link** (Optional)
   - Add "Access Recovery" or "Can't access account?" link in login page
   - Link to `/recover-access`

2. **User Setup** (Backend)
   - Generate recovery codes during user account creation
   - Allow users to generate new recovery codes
   - Store recovery codes securely (hashed)

3. **Testing**
   - Test recovery code input with valid codes
   - Test password reset after code verification
   - Test error scenarios
   - Test dark mode
   - Test mobile responsiveness

## Comparison: Forgot Password vs Access Recovery

| Feature | Forgot Password | Access Recovery |
|---------|-----------------|-----------------|
| Entry Method | Email link | Recovery code |
| Code Delivery | Email | User-saved |
| Time Sensitive | Yes (email link) | No (saved code) |
| Requires Email Access | Yes | No |
| Flow Steps | 3 (Email → Code → Password) | 2 (Code → Password) |
| Use Case | Standard password reset | Locked out of email |

## Future Enhancements

1. Add recovery code generation UI
2. Allow multiple recovery codes
3. Track recovery code usage
4. Add 2FA option after recovery
5. Send email notification after recovery
6. Add analytics/logging
7. Implement code expiration
8. Add backup phone number recovery
9. Add security questions as alternative
10. Add IP address verification

## State Management

### AccessRecoveryCodePage State
```typescript
- recoveryCode: string
- error: string | null
- success: boolean
- isLoading: boolean
```

### RecoveryNewPasswordPage State
```typescript
- password: string
- confirmPassword: string
- showPassword: boolean
- showConfirmPassword: boolean
- error: string | null
- success: boolean
- isLoading: boolean
```

## Icon Reference

| Icon | Usage | Color |
|------|-------|-------|
| Shield | Recovery code page | Orange (#E1784F) |
| Lock | Password set page | Teal (#4DB6AC) |
| Eye/EyeOff | Password visibility | Gray |
| AlertCircle | Error messages | Red |
| CheckCircle | Success messages | Green |
| X | Close button | Gray |
| ArrowRight | Submit button | White |
| Loader | Loading state | White |
