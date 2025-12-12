-- Fix for Clerk + Supabase Integration
-- Run this in Supabase SQL Editor to update RLS policies

-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own entries" ON entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON entries;
DROP POLICY IF EXISTS "Users can update own entries" ON entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON entries;

-- Create new policies that work with Clerk JWT
-- Clerk stores the user ID in the 'sub' claim of the JWT

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.jwt()->>'sub' = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.jwt()->>'sub' = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.jwt()->>'sub' = id);

-- Entries table policies
CREATE POLICY "Users can view own entries" ON entries
  FOR SELECT USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert own entries" ON entries
  FOR INSERT WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update own entries" ON entries
  FOR UPDATE USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete own entries" ON entries
  FOR DELETE USING (auth.jwt()->>'sub' = user_id);
