# 🔐 Authentication Setup Guide

## Overview
This application uses **Supabase Authentication** with a **login-only** approach. Users cannot self-register; they must be added by an administrator through the Supabase Dashboard.

## 📋 Setup Steps

### Step 1: Run Database Migrations

1. **Go to your Supabase SQL Editor:**
   - Visit: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/sql

2. **Run the initial schema:**
   - Copy the contents of `supabase/migrations/01_initial_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

This will create:
- ✅ `profiles` table (extends auth.users)
- ✅ `workspaces` table
- ✅ `workspace_members` table
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for profile creation

### Step 2: Add Your User

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/auth/users
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email:** `sakshimanoorkar@gmail.com`
   - **Password:** `#Sakshi$443`
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**

**Option B: Using SQL (Advanced)**

If you prefer SQL, you can use the script in `supabase/add_initial_user.sql`, but the Dashboard method is simpler and more reliable.

### Step 3: Configure Email Settings (For Password Reset)

1. Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/auth/templates
2. Configure the **"Reset Password"** email template
3. Update the redirect URL to: `http://localhost:3000/reset-password` (for development)
4. For production, update to your production domain

### Step 4: Test Authentication

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/login

3. **Login with:**
   - Email: `sakshimanoorkar@gmail.com`
   - Password: `#Sakshi$443`

4. **Test password reset:**
   - Click "Forgot your password?"
   - Enter your email
   - Check your inbox for the reset link
   - Follow the link and set a new password

## 🎯 Features Implemented

### ✅ Login Page
- Simple email/password authentication
- Error handling with user-friendly messages
- Link to forgot password

### ✅ Forgot Password Flow
- User enters email
- Supabase sends reset link via email
- Success confirmation message

### ✅ Reset Password Flow
- User clicks link from email
- Enters new password (with confirmation)
- Password validation (min 6 characters, must match)
- Automatic redirect to login after success

### ✅ Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Workspace-based access control
- Secure password hashing by Supabase

### ✅ Middleware Protection
- Automatic redirect to login for unauthenticated users
- Protected routes: `/app/*`, `/dashboard/*`
- Public routes: `/login`, `/forgot-password`, `/reset-password`

## 🚫 What's NOT Included (By Design)

- ❌ Self-registration page
- ❌ Public signup form
- ❌ Social authentication (Google, GitHub, etc.)

Users must be added by administrators through the Supabase Dashboard.

## 📁 File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # Forgot password page
│   │   ├── reset-password/
│   │   │   └── page.tsx          # Reset password page
│   │   └── layout.tsx            # Auth layout
│   └── (dashboard)/              # Protected dashboard routes
├── components/
│   └── auth/
│       ├── AuthForm.tsx          # Login form component
│       ├── ForgotPasswordForm.tsx # Forgot password form
│       └── ResetPasswordForm.tsx  # Reset password form
├── lib/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase client
│       ├── server.ts             # Server-side Supabase client
│       └── middleware.ts         # Auth middleware
└── middleware.ts                 # Next.js middleware

supabase/
├── migrations/
│   └── 01_initial_schema.sql    # Database schema
└── add_initial_user.sql         # User creation guide
```

## 🔄 Adding More Users

To add additional users in the future:

1. Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/auth/users
2. Click **"Add user"**
3. Enter email and password
4. ✅ Check **"Auto Confirm User"**
5. Click **"Create user"**

The `profiles` table will be automatically populated via the database trigger.

## 🛠️ Troubleshooting

### Issue: "Invalid login credentials"
- ✅ Verify the user exists in Supabase Dashboard
- ✅ Check that "Auto Confirm User" was enabled
- ✅ Ensure password is correct

### Issue: "Email not confirmed"
- ✅ In Supabase Dashboard, find the user
- ✅ Click the three dots → "Confirm email"

### Issue: Password reset email not received
- ✅ Check spam folder
- ✅ Verify email settings in Supabase Dashboard
- ✅ Check that SMTP is configured (or use Supabase's default)

### Issue: Redirect loop after login
- ✅ Check that the user has a profile in the `profiles` table
- ✅ Verify RLS policies are correctly set up
- ✅ Check browser console for errors

## 🎨 Customization

### Change Password Requirements
Edit `src/components/auth/ResetPasswordForm.tsx`:
```typescript
// Current: minimum 6 characters
minLength={6}

// Change to your requirement:
minLength={8}
```

### Change Redirect After Login
Edit `src/components/auth/AuthForm.tsx`:
```typescript
// Current redirect
router.push("/app")

// Change to your preferred route
router.push("/dashboard")
```

### Customize Email Templates
1. Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/auth/templates
2. Edit the templates for:
   - Password Reset
   - Email Confirmation (if needed)
   - Magic Link (if you add it later)

## 🚀 Next Steps

After authentication is working:

1. **Build the main dashboard** (`/app` or `/dashboard`)
2. **Create workspace management** features
3. **Add user profile settings** page
4. **Implement role-based access control** (admin, member, viewer)
5. **Add more tables** as per your application needs

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase logs: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/logs/explorer
3. Verify environment variables in `.env.local`
4. Ensure the database migrations ran successfully

---

**Created:** 2026-01-03  
**Last Updated:** 2026-01-03
