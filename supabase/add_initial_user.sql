-- =====================================================
-- Add Initial User
-- =====================================================
-- This script adds a user directly to Supabase Auth
-- Email: sakshimanoorkar@gmail.com
-- Password: #Sakshi$443
-- =====================================================

-- Note: This SQL should be run in the Supabase SQL Editor
-- The password will be hashed automatically by Supabase

-- Step 1: Insert user into auth.users (Supabase will handle password hashing)
-- You need to run this in Supabase Dashboard > SQL Editor

-- IMPORTANT: Run this query in your Supabase Dashboard SQL Editor:
-- Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/sql

/*
-- Create the user with email confirmation
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'sakshimanoorkar@gmail.com',
    crypt('#Sakshi$443', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sakshi Manoorkar"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);
*/

-- =====================================================
-- ALTERNATIVE: Use Supabase Dashboard
-- =====================================================
-- 1. Go to: https://pmafdbeyfoeyzraxkrpw.supabase.co/project/_/auth/users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter:
--    - Email: sakshimanoorkar@gmail.com
--    - Password: #Sakshi$443
--    - Check "Auto Confirm User" ✓
-- 4. Click "Create user"
-- =====================================================
