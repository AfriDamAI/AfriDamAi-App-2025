# Password Reset Flow Architecture

## Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│ LOGIN PAGE (/login)                                         │
│ - User enters email and password                            │
│ - Button: "Forgot your password?"                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ FORGOT PASSWORD PAGE (/forgot-password)                     │
│ ✓ Email input field                                         │
│ ✓ POST /api/auth/forgot-password { email }                 │
│ ✓ Success: "Check your email for reset code"              │
│ ✓ Button: "SEND RESET LINK"                               │
│ ✓ Link: "Back to login"                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ (User receives email with reset code)
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ VERIFY RESET CODE PAGE (/reset-password)                    │
│ ✓ Code input field (copy-paste friendly)                  │
│ ✓ Client-side code validation                              │
│ ✓ Success redirects to new-password page                   │
│ ✓ Button: "VERIFY CODE"                                    │
│ ✓ Link: "Back to login"                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Code verified, token passed as query param
                 │ ?token=reset-code
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ SET NEW PASSWORD PAGE (/reset-password/new-password)       │
│ ✓ New password input (show/hide toggle)                    │
│ ✓ Confirm password input (show/hide toggle)                │
│ ✓ Validation: min 8 characters, matching passwords         │
│ ✓ POST /api/auth/reset-password { token, newPassword }    │
│ ✓ Success: "Password updated! Redirecting..."             │
│ ✓ Button: "RESET PASSWORD"                                 │
│ ✓ Link: "Back to verify code"                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Auto-redirect to login on success
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ LOGIN PAGE (/login)                                         │
│ - User can now login with new password                      │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### ForgotPasswordPage State
```
- email: string
- error: string | null
- success: boolean
- isLoading: boolean
```

### EnterResetCodePage State
```
- code: string
- error: string | null
- success: boolean
- isLoading: boolean
```

### SetNewPasswordPage State
```
- password: string
- confirmPassword: string
- showPassword: boolean
- showConfirmPassword: boolean
- error: string | null
- success: boolean
- isLoading: boolean
```

## API Request/Response Flow

### Step 1: Forgot Password
```
REQUEST:
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

RESPONSE:
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Step 2: Verify Code (Client-side)
```
- No API call required
- Just validate code exists and is not empty
- Pass code as token in URL query parameter
- Redirect to /reset-password/new-password?token={code}
```

### Step 3: Reset Password
```
REQUEST:
POST /api/auth/reset-password
{
  "token": "reset-code-from-email",
  "newPassword": "NewSecurePassword123"
}

RESPONSE:
{
  "success": true,
  "message": "Password reset successfully"
}

Then redirect to /login
```

## Error Scenarios

### Forgot Password Errors
- Empty email field → "Please enter your email address"
- Invalid email format → Validation by input type
- Backend error → Display backend error message
- Network error → "Connection failed, please try again"

### Verify Code Errors
- Empty code field → "Please enter the reset code from your email"
- Invalid code → Handled by backend in next step
- Expired code → Backend will return error

### Set Password Errors
- Missing token → "Invalid reset code. Please go back and verify your code again"
- Empty password fields → "Please fill in all fields"
- Password too short → "Password must be at least 8 characters long"
- Passwords don't match → "Passwords do not match"
- Invalid token → "Failed to reset password. Please request a new code"
- Network error → Display error message

## Success Messages

### Forgot Password Success
✓ "Check your email for password reset instructions"
- User receives email with reset code
- Can proceed to verify code page

### Code Verification Success
✓ "Code verified! Redirecting..."
- Automatically navigates to password set page
- Token passed securely via URL query parameter

### Password Reset Success
✓ "Password reset successfully! Redirecting to login..."
- Auto-redirects to login page after 2 seconds
- User can now login with new password

## Security Considerations

1. **Token Handling**
   - Reset codes passed via URL query parameter
   - Should be one-time use tokens (handled by backend)
   - Should expire after set time (handled by backend)

2. **Password Security**
   - Minimum 8 characters enforced
   - Show/hide toggle for visibility
   - Confirmation field to prevent typos
   - Client-side validation before submission

3. **Rate Limiting**
   - Backend should implement rate limiting on forgot-password endpoint
   - Backend should implement rate limiting on reset-password endpoint

4. **Email Verification**
   - Reset codes should only be valid for limited time
   - Codes should be invalidated after successful reset
   - Multiple reset requests should invalidate previous codes

## Component Reusability

### ForgotPasswordForm Component
Can be used in:
- Modal dialogs
- Settings pages
- Embedded in other forms
- Takes optional `onSuccess` and `onCancel` callbacks

### ResetPasswordForm Component
Can be used in:
- Modal dialogs
- Multiple reset scenarios
- Settings pages
- Takes required `token` prop and optional callbacks

## Styling Reference

### Colors
- Primary Orange: #E1784F (forgot password, verify code pages)
- Primary Teal: #4DB6AC (set password page)
- Background: White with dark mode support (#050505)

### Icons Used
- Mail icon: Forgot password page
- Lock icon: Set password page
- Eye/EyeOff: Password visibility toggles
- AlertCircle: Error messages
- CheckCircle: Success messages
- X: Close/cancel button
- ArrowRight: Submit button

### Layout
- Full-screen centered form
- Max width: 2xl (42rem)
- Padding: responsive (6-12)
- Gradient blur backgrounds
- Smooth Framer Motion animations
