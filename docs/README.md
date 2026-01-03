# SmarterBOT

A Next.js application for RUT management and business operations.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Running the Application

1. Run the development server:
```bash
pnpm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
pnpm run build
pnpm run start
```

## Project Structure

- `components/` - React components
- `pages/` - Next.js pages
- `services/` - Service utilities (Supabase, authentication)
- `public/` - Static assets
- `styles/` - CSS styles
- `scripts/` - Utility scripts
- `database/` - Database related files
- `integrations/` - Third-party integrations