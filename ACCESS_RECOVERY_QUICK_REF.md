# Access Recovery - Quick Reference

## 🎯 What's New

Two new authentication flows created for account access recovery using saved recovery codes.

## 📍 Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/recover-access` | Access Recovery Code Input | Enter saved recovery code |
| `/recover-access/new-password` | Set New Password | Create new password after code verification |

## 🎨 UI Components

### Recovery Code Input Page
```
┌─────────────────────────────────┐
│  🛡️  SHIELD ICON (Orange)       │
│                                 │
│  ACCESS RECOVERY               │
│  Enter your Access Recovery    │
│  code to regain account access │
│                                 │
│  [PASTE CODE HERE - centered]   │
│                                 │
│  [VERIFY RECOVERY CODE →]       │
│  [Back to login]                │
└─────────────────────────────────┘
```

### Set Password Page
```
┌─────────────────────────────────┐
│  🔒  LOCK ICON (Teal)          │
│                                 │
│  SET NEW PASSWORD              │
│  Create a strong password to   │
│  secure your account           │
│                                 │
│  [NEW PASSWORD 👁]              │
│  [CONFIRM PASSWORD 👁]          │
│                                 │
│  [RESET PASSWORD →]            │
│  [Back to recovery code]        │
└─────────────────────────────────┘
```

## 🔗 User Flow

```
Login Page
    ↓
[Access Recovery] or [Can't access account?]
    ↓
Enter Recovery Code (/recover-access)
    ↓
Verify Code
    ↓
Set New Password (/recover-access/new-password)
    ↓
Submit to API
    ↓
Redirect to Login
    ↓
User can login with new password
```

## 💻 Reusable Components

### 1. AccessRecoveryCodeForm
```tsx
import { AccessRecoveryCodeForm } from "@/components/access-recovery-code-form"

<AccessRecoveryCodeForm 
  onSuccess={() => console.log("verified")}
  onCancel={() => console.log("cancelled")}
/>
```

### 2. RecoveryPasswordForm
```tsx
import { RecoveryPasswordForm } from "@/components/recovery-password-form"

<RecoveryPasswordForm 
  token="recovery-code"
  onSuccess={() => router.push("/login")}
  onCancel={() => router.back()}
/>
```

## ✅ Features

- ✅ Shield icon for recovery code input
- ✅ Lock icon for password set
- ✅ Orange and teal accent colors
- ✅ Show/hide password toggles
- ✅ Smooth animations
- ✅ Error handling with icons
- ✅ Success confirmations
- ✅ Auto redirects
- ✅ Dark mode support
- ✅ Mobile responsive
- ✅ Form validation
- ✅ Loading states

## 📋 Validation Rules

| Field | Rules |
|-------|-------|
| Recovery Code | Required, min 6 chars |
| Password | Required, min 8 chars |
| Confirm Password | Required, must match |

## 🚀 API Endpoint

```
POST /api/auth/reset-password
{
  "token": "recovery-code",
  "newPassword": "NewPassword123"
}
```

## 🎯 Testing Checklist

- [ ] Navigate to `/recover-access`
- [ ] Enter recovery code and verify
- [ ] Enter mismatched passwords
- [ ] Enter short password (< 8 chars)
- [ ] Successfully reset password
- [ ] Verify redirect to login
- [ ] Test dark mode
- [ ] Test on mobile
- [ ] Test password visibility toggles
- [ ] Test back buttons

## 🔐 Security

- Backend validates recovery codes
- Codes are one-time use (backend)
- Codes expire after timeout (backend)
- Passwords must be 8+ characters
- Confirmation prevents typos
- Rate limiting recommended (backend)

## 📂 File Structure

```
app/(auth)/recover-access/
├── page.tsx
└── new-password/
    └── page.tsx

components/
├── access-recovery-code-form.tsx
└── recovery-password-form.tsx
```

## 🎨 Colors

| Element | Color | Hex |
|---------|-------|-----|
| Recovery Code Page | Orange | #E1784F |
| Password Page | Teal | #4DB6AC |
| Background | White/Black | #FFFFFF/#050505 |
| Error | Red | #EF4444 |
| Success | Green | #10B981 |

## 🔄 State Flow

### Step 1: Recovery Code Input
```
recoveryCode → (empty) → (not empty) → (valid) → success
error → null → (if validation fails) → error message
```

### Step 2: Password Reset
```
password → (empty) → (8+ chars) → (matches confirm) → success
confirmPassword → (empty) → (matches password) → success
```

## 💡 Use Cases

1. **User locked out of email** - Can't access password reset email
2. **Compromised email account** - Email account hacked
3. **Lost access to recovery email** - Changed email address
4. **Multiple verification methods** - Backup recovery option
5. **Emergency access** - Need quick account recovery

## 📝 Next Steps (Optional)

1. Add link in login page
2. Add link in settings page
3. Allow generating new recovery codes
4. Store multiple recovery codes per user
5. Log recovery code usage
6. Add 2FA after recovery
7. Send email notification after recovery
8. Add recovery code backup download

## 🆘 Troubleshooting

**Recovery code not working?**
- Check for typos
- Verify code hasn't expired (backend check)
- Ensure code hasn't been used already
- Request new recovery code

**Password reset failed?**
- Check password meets requirements (8+ chars)
- Verify passwords match
- Check network connection
- Try again or contact support

**Stuck on page?**
- Use "Back" button to previous step
- Use "Back to login" to go to login
- Check for error messages
- Refresh page if needed
