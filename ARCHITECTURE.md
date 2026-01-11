# SmarterBOT Unified Architecture

## Overview
This document describes the unified architecture for the SmarterBOT platform, supporting both web and mobile applications with a shared backend infrastructure.

## System Architecture

### Backend Layer
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions

### Frontend Layers
- **Web Application**: Next.js 13+ with React
- **Shared Logic**: Common utilities and services

### Infrastructure
- **Hosting**: Vercel (Web)
- **Database**: Supabase Cloud
- **CI/CD**: GitHub Actions

## Authentication Flow

### Single Sign-On (SSO)
The web application uses Supabase authentication:

1. User authenticates via Google OAuth
2. Supabase creates user session
3. User data stored and managed
4. Permissions and roles applied

## Data Architecture

### Database Schema
Shared database schema accessible to both platforms:
- `users` - User profiles and information
- `products` - Product catalog with photo URLs
- `qr_codes` - QR code tracking and metadata
- `nfc_tags` - NFC tag information
- `sessions` - User session tracking

### Real-time Features
- Live updates across both platforms
- Notification system
- Synchronized data changes


## API Specifications

### OpenAPI Compliance
- All backend endpoints documented with OpenAPI 3.0
- Shared TypeScript interfaces
- Automated client generation

### API Versioning
- RESTful API design
- Versioned endpoints (v1, v2)
- Backward compatibility maintained

## Development Workflow

### Monorepo Structure
```
/smarter.rut
├── / (Next.js web app)
├── /services (Shared services)
├── /types (Shared TypeScript definitions)
├── /scripts (Build and deployment scripts)
└── /docs (Documentation)
```

### Shared Code
- Authentication utilities
- API clients
- Type definitions
- Common components (where applicable)

## Deployment Strategy

### Web Application
- Deployed to Vercel
- Environment-specific configurations
- Automated testing and deployment

## Security Considerations

### Authentication Security
- Secure OAuth implementation
- Token refresh mechanisms
- Session management
- Password policies

### Data Security
- Row-level security in Supabase
- Encrypted data transmission
- Secure API keys management

## Performance Optimization

### Web Performance
- Next.js static generation
- Image optimization
- Caching strategies
- CDN integration


## Monitoring and Analytics

### Analytics
- Event tracking
- User behavior analysis
- Performance monitoring
- Error tracking

## Governance and Specifications

### Open Specifications
- OpenAPI 3.0 for API documentation
- OpenID Connect for authentication
- OAuth 2.0 for authorization
- Semantic versioning

### Documentation Standards
- API documentation
- Architecture decision records
- Development guidelines
- Deployment procedures