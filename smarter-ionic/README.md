# SmarterBOT Ionic Mobile App

This is the mobile application for SmarterBOT, built with Ionic React and integrated with the main web application's systems.

## Features

- User authentication (email/password, magic link, OAuth)
- Access to user account information
- RUT validation and display
- Payment status tracking
- Integration with the main Supabase backend

## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm/yarn
- Access to the main Supabase project credentials

## Setup

1. Install dependencies:
   ```bash
   cd smarter-ionic
   pnpm install
   # or
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Then edit .env with your Supabase credentials
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Integration with Main System

This mobile app connects to the same Supabase backend as the main web application, sharing:
- Authentication system
- User accounts and profiles
- RUT validation utilities
- Payment status information

## Building for Production

```bash
pnpm run build
```

## Running on Mobile Devices

To run on iOS or Android devices, you'll need to add the respective platforms:

```bash
# Add capacitor platforms
npx cap add ios
npx cap add android

# Build the web assets
pnpm run build

# Sync assets to native platforms
npx cap sync

# Open the native IDE
npx cap open ios
npx cap open android
```

## Architecture Notes

- Uses the same shared authentication service as the web app
- Converts JavaScript files to TypeScript for better type safety
- Implements protected routing for authenticated areas
- Accesses the same Supabase database tables as the web app