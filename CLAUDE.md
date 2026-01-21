# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

A Next.js 16 reference implementation for Supabase authentication using the App
Router. Uses React 19, TypeScript, and Tailwind CSS v4.

## Commands

```bash
# Development (uses Bun package manager)
bun dev          # Start development server
bun run build    # Build for production
bun start        # Run production server
bun run lint     # Run ESLint
```

## Architecture

### Supabase Client Setup (`/lib/supabase`)

- **`client.ts`** - Browser-side Supabase client for client components
- **`server.ts`** - Server-side Supabase client with cookie handling for Server
  Components and Route Handlers
- **`admin.ts`** - Admin client with service role key for privileged operations
  (user deletion, etc.)
- **`proxy.ts`** - Proxy helper for session updates

### Database Types (`/types`)

- **`supabase-flennar-types.ts`** - Auto-generated types from Supabase schema
  (do not edit manually). Use `Tables<"tablename">` for row types,
  `TablesInsert<"tablename">` for inserts, `TablesUpdate<"tablename">` for
  updates.

### Auth Pages (`/app`)

- `/login` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Set new password after reset link
- `/auth/complete-profile` - Profile completion after email confirmation
- `/auth/auth-code-error` - Error page for invalid/expired auth links
- `/dashboard` - Protected dashboard with user info

### Auth Routes (`/app/auth`)

- `/auth/confirm/route.ts` - Handles email confirmation with `token_hash`
  (signup, email change)
- `/auth/callback/route.ts` - Handles PKCE code exchange (OAuth, magic links)

### Server Actions (`/app/actions`)

- **`auth.ts`** - login, signup, forgotPassword, resetPassword, logout,
  deleteAccount
- **`profile.ts`** - updateProfile (with avatar upload to Supabase Storage)

### Session Management Pattern

The app uses cookie-based SSR authentication with PKCE flow:

1. **Server client** (`lib/supabase/server.ts`) manages cookies via
   `@supabase/ssr`
2. **Proxy** (`proxy.ts`) refreshes sessions on each request and redirects
   unauthenticated users to `/login`
3. Public routes: `/`, `/login`, `/auth/*`

### Auth Flow

1. User signs up → receives confirmation email
2. Clicks email link → `/auth/confirm` verifies token
3. Redirects to `/auth/complete-profile` to set username, full name, avatar
4. Profile saved → redirected to `/dashboard`

### Key Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY          # For admin operations (user deletion)
NEXT_PUBLIC_SITE_URL               # For email redirect URLs
```

### Supabase Storage

- **`avatars`** bucket for profile pictures
- Files stored as `{user_id}/avatar.{ext}`
- Requires RLS policies for authenticated upload/update/delete

## Documentation

The `/docs-nextjs/` directory contains Next.js 16 documentation. Note: Middleware
is now called "Proxy" in Next.js 16.
