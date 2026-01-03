# Deployment and CI/CD Strategy for SmarterBOT Platform

## Overview
This document outlines the deployment and Continuous Integration/Continuous Deployment (CI/CD) strategy for the SmarterBOT platform, supporting both web (Next.js) and mobile (Ionic) applications with a shared Supabase backend.

## Deployment Architecture

### Infrastructure Components
- **Web Application**: Deployed on Vercel
- **Mobile Application**: Built with Capacitor, deployed to app stores
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **API Gateway**: Vercel Edge Functions / Supabase Edge Functions
- **CDN**: Vercel CDN for web assets
- **Monitoring**: Vercel Analytics, Supabase Analytics

### Environment Strategy
- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live production environment

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linting
        run: pnpm run lint
      
      - name: Run tests
        run: pnpm run test
      
      - name: Run build
        run: pnpm run build

  deploy-web-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build web app
        run: pnpm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel (Staging)
        run: |
          npx vercel --token=${{ secrets.VERCEL_TOKEN }} \
            --scope=${{ secrets.VERCEL_ORG_ID }} \
            --prod=false

  deploy-web-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build web app
        run: pnpm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel (Production)
        run: |
          npx vercel --token=${{ secrets.VERCEL_TOKEN }} \
            --scope=${{ secrets.VERCEL_ORG_ID }} \
            --prod=true

  build-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: cd smarter-ionic && pnpm install
      
      - name: Build mobile app
        run: |
          cd smarter-ionic
          pnpm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
      
      - name: Setup Capacitor
        run: |
          cd smarter-ionic
          npx cap add android
          npx cap add ios
      
      - name: Build Android APK
        run: |
          cd smarter-ionic
          npx cap open android
          # Build APK using Gradle
          cd android
          ./gradlew assembleRelease
          
      - name: Upload Android APK
        uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: smarter-ionic/android/app/build/outputs/apk/release/app-release.apk

  deploy-supabase:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        run: |
          curl -L https://cli.supabase.com/install.sh | sh
      
      - name: Deploy database schema
        run: |
          supabase db push
        env:
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
      
      - name: Deploy Edge Functions
        run: |
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### Environment Configuration
```yaml
# .github/workflows/environment.yml
# Environment-specific configurations

environments:
  staging:
    url: https://staging.smarterbot.store
    supabase_url: ${{ secrets.STAGING_SUPABASE_URL }}
    supabase_anon_key: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
  
  production:
    url: https://smarterbot.store
    supabase_url: ${{ secrets.PROD_SUPABASE_URL }}
    supabase_anon_key: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
```

## Deployment Environments

### Development Environment
- **Purpose**: Local development and testing
- **Tools**: 
  - Local Supabase CLI for local database
  - Next.js development server
  - Ionic development server
- **Configuration**:
  - Local environment variables
  - Development database
  - Hot reloading enabled

### Staging Environment
- **Purpose**: Pre-production testing
- **Deployment**: Automatic deployment on `develop` branch push
- **URL**: `https://staging.smarterbot.store`
- **Configuration**:
  - Staging database
  - Staging Supabase project
  - Feature flags enabled
  - Comprehensive testing

### Production Environment
- **Purpose**: Live production application
- **Deployment**: Automatic deployment on `main` branch push
- **URL**: `https://smarterbot.store`
- **Configuration**:
  - Production database
  - Production Supabase project
  - Optimized performance settings
  - Monitoring and alerting enabled

## Web Application Deployment (Next.js)

### Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "name": "smarterbot-web",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "serverless": true
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Build Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static export if needed
  trailingSlash: true,
  images: {
    domains: [
      'smarterbot.store',
      'supabase.co',
      'supabase.in',
      'localhost',
      '127.0.0.1'
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = nextConfig;
```

## Mobile Application Deployment (Ionic)

### Capacitor Configuration
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smarterbot.app',
  appName: 'SmarterBOT',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      backgroundColor: "#3880ff",
      androidSplashResourceName: "splash",
      iosScale: "scale",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

### Android Build Configuration
```gradle
// smarter-ionic/android/app/build.gradle
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "com.smarterbot.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
    
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

### iOS Build Configuration
```xml
<!-- smarter-ionic/ios/App/App/Info.plist -->
<key>CFBundleIdentifier</key>
<string>com.smarterbot.app</string>
<key>CFBundleName</key>
<string>SmarterBOT</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>LSRequiresIPhoneOS</key>
<true/>
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to capture photos and scan QR codes.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select photos.</string>
<key>NFCReaderUsageDescription</key>
<string>This app uses NFC to read tags and connect to products.</string>
```

## Database Deployment (Supabase)

### Database Migration Script
```bash
#!/bin/bash
# scripts/deploy-database.sh

set -e

echo "Starting database deployment..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    curl -L https://cli.supabase.com/install.sh | sh
fi

# Deploy schema changes
echo "Deploying schema changes..."
supabase db push

# Deploy seed data if needed
echo "Deploying seed data..."
supabase db seed

echo "Database deployment completed successfully!"
```

### Supabase Configuration
```toml
# supabase/config.toml
# Project configuration file

[api]
port = 54321
cors_allow_origins = ["http://localhost:3000", "https://smarterbot.store"]

[db]
port = 54322
shadow_port = 54320
migrations_dir = "supabase/migrations"
seed_enabled = true

[studio]
port = 54323

[auth]
site_url = "https://smarterbot.store"
additional_redirect_urls = ["http://localhost:3000"]
jwt_expiry = 3600
enable_signup = true

[auth.external.google]
client_id = "your-google-client-id"
secret = "your-google-client-secret"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

## Monitoring and Observability

### Application Monitoring
```yaml
# monitoring/grafana-dashboards.yml
apiVersion: 1
providers:
  - name: 'Supabase Dashboard'
    orgId: 1
    folder: 'Supabase'
    type: file
    disableDeletion: false
    editable: true
    options:
      path: /etc/grafana/provisioning/dashboards/supabase
```

### Logging Configuration
```javascript
// services/loggingService.js
class LoggingService {
  static log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      environment: process.env.NODE_ENV,
      service: 'smarterbot-platform'
    };
    
    // Send to logging service (e.g., LogRocket, Sentry, etc.)
    console.log(JSON.stringify(logEntry));
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to external logging service
      this.sendToExternalLogger(logEntry);
    }
  }
  
  static error(message, error, metadata = {}) {
    this.log('error', message, {
      ...metadata,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }
  
  static info(message, metadata = {}) {
    this.log('info', message, metadata);
  }
}

export default LoggingService;
```

## Security and Compliance

### Security Scanning
```yaml
# .github/workflows/security.yml
name: Security Scanning

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly security scans

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run dependency security audit
        run: |
          npm audit --audit-level high
          # Or use pnpm audit when available
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --all-projects --fail-on=high
```

### Environment Secrets Management
```bash
# scripts/manage-secrets.sh
#!/bin/bash

# Script to manage environment secrets across environments

ENVIRONMENT=$1
ACTION=$2

case $ENVIRONMENT in
  "development")
    SECRETS_FILE=".env.development"
    ;;
  "staging")
    SECRETS_FILE=".env.staging"
    ;;
  "production")
    SECRETS_FILE=".env.production"
    ;;
  *)
    echo "Usage: $0 [development|staging|production] [view|update|encrypt]"
    exit 1
    ;;
esac

case $ACTION in
  "view")
    echo "Viewing secrets for $ENVIRONMENT environment:"
    cat $SECRETS_FILE
    ;;
  "update")
    echo "Updating secrets for $ENVIRONMENT environment..."
    # Add logic to update secrets
    ;;
  "encrypt")
    echo "Encrypting secrets for $ENVIRONMENT environment..."
    # Add logic to encrypt secrets
    ;;
  *)
    echo "Usage: $0 [development|staging|production] [view|update|encrypt]"
    exit 1
    ;;
esac
```

## Rollback Strategy

### Web Application Rollback
```bash
#!/bin/bash
# scripts/rollback-web.sh

# Rollback web application to previous version

echo "Starting web application rollback..."

# Get the previous deployment
PREVIOUS_DEPLOYMENT=$(vercel deployments --limit 1 --scope $VERCEL_ORG_ID | head -2 | tail -1)

if [ -z "$PREVIOUS_DEPLOYMENT" ]; then
    echo "No previous deployment found"
    exit 1
fi

echo "Rolling back to deployment: $PREVIOUS_DEPLOYMENT"

# Promote previous deployment to production
vercel alias set $PREVIOUS_DEPLOYMENT $VERCEL_PRODUCTION_DOMAIN --scope $VERCEL_ORG_ID

echo "Web application rollback completed!"
```

### Database Rollback
```bash
#!/bin/bash
# scripts/rollback-database.sh

# Rollback database to previous version

echo "Starting database rollback..."

# Get the previous migration
PREVIOUS_MIGRATION=$(ls -t supabase/migrations/ | head -2 | tail -1)

if [ -z "$PREVIOUS_MIGRATION" ]; then
    echo "No previous migration found"
    exit 1
fi

echo "Rolling back to migration: $PREVIOUS_MIGRATION"

# Rollback to previous migration
supabase db reset

echo "Database rollback completed!"
```

## Performance Optimization

### Caching Strategy
```javascript
// middleware/cache.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Set caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }
  
  // Set caching headers for API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/_next/static/:path*',
    '/api/:path*',
    '/:path*',
  ],
};
```

### CDN Configuration
```json
// vercel.json (CDN configuration)
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=300, stale-while-revalidate=600"
        }
      ]
    }
  ]
}
```

## Mobile App Store Deployment

### Android Play Store Deployment
```yaml
# .github/workflows/deploy-android.yml
name: Deploy Android App

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types:
      - completed
    branches: [main]

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Download APK artifact
        uses: actions/download-artifact@v3
        with:
          name: android-apk
          path: app/build/outputs/apk/release/
      
      - name: Deploy to Google Play Console
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_CONSOLE_SERVICE_ACCOUNT }}
          packageName: com.smarterbot.app
          releaseFiles: app/build/outputs/apk/release/app-release.apk
          track: internal
          status: completed
```

### iOS App Store Deployment
```yaml
# .github/workflows/deploy-ios.yml
name: Deploy iOS App

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types:
      - completed
    branches: [main]

jobs:
  deploy-ios:
    runs-on: macos-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: latest-stable
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: cd smarter-ionic && pnpm install
      
      - name: Build iOS app
        run: |
          cd smarter-ionic
          pnpm run build
          npx cap add ios
          npx cap open ios
      
      - name: Archive iOS app
        run: |
          cd smarter-ionic/ios/App
          xcodebuild archive \
            -workspace App.xcworkspace \
            -scheme App \
            -archivePath App.xcarchive \
            -configuration Release
      
      - name: Export IPA
        run: |
          cd smarter-ionic/ios/App
          xcodebuild -exportArchive \
            -archivePath App.xcarchive \
            -exportPath . \
            -exportFormat IPA \
            -destination generic/platform=iOS
      
      - name: Deploy to App Store Connect
        run: |
          xcrun altool --upload-app \
            -f App.ipa \
            -u ${{ secrets.APPSTORE_USERNAME }} \
            -p ${{ secrets.APPSTORE_PASSWORD }} \
            -t ios
```

## Deployment Validation

### Health Check Script
```javascript
// scripts/health-check.js
const axios = require('axios');

async function checkHealth() {
  const services = [
    { name: 'Web App', url: 'https://smarterbot.store/api/health' },
    { name: 'Supabase Auth', url: 'https://your-project.supabase.co/auth/v1/health' },
    { name: 'Supabase REST', url: 'https://your-project.supabase.co/rest/v1/health' }
  ];
  
  console.log('Starting health checks...\n');
  
  for (const service of services) {
    try {
      const response = await axios.get(service.url, {
        timeout: 10000,
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY
        }
      });
      
      console.log(`✅ ${service.name}: ${response.status} - OK`);
    } catch (error) {
      console.log(`❌ ${service.name}: ${error.message}`);
    }
  }
  
  console.log('\nHealth check completed!');
}

checkHealth().catch(console.error);
```

This comprehensive deployment and CI/CD strategy ensures that the SmarterBOT platform can be reliably deployed across multiple environments with proper testing, security, and monitoring in place.