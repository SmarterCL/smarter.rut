# Mobile App Design: SmarterBOT Application

## Overview
This document previously outlined the design for the SmarterBOT mobile application built with Ionic, but the mobile application has been discontinued. The platform now focuses solely on the web application.

## Current Architecture

### Technology Stack
- **Framework**: Next.js with React
- **State Management**: React Hooks + Context API
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase
- **UI Components**: React Bootstrap components

### Core Features
1. Google OAuth Login
2. Photo Capture and Management
3. Product Management

## Feature Design

### 1. Google OAuth Login

#### Implementation
- Use Supabase Auth with Google provider
- Secure token storage in browser

#### User Flow
1. User visits website
2. Clicks "Sign in with Google" button
3. Redirected to Google OAuth
4. User authenticates with Google
5. Redirected back to web app with tokens
6. Supabase creates/links user account
7. User enters main dashboard

#### Components
- `GoogleAuthButton` - Custom component for Google login
- `AuthService` - Handles authentication logic

### 2. Photo Capture and Management

#### Implementation
- HTML5 File API for photo upload
- Supabase Storage for photo uploads
- Browser caching for quick access

#### Features
- Upload new photos
- Select from device
- Upload to Supabase Storage
- View and manage photos

#### Components
- `PhotoUpload` - Upload interface
- `PhotoGallery` - Photo browsing
- `PhotoUploadService` - Upload management

### 3. QR Code Generation

#### Implementation
- QR code generation using library
- Integration with backend API

#### Features
- Generate QR codes for products
- Link QR codes to products
- Export QR codes

#### Components
- `QRGenerator` - QR code generation
- `QRService` - QR code logic

### 4. Product Management

#### Implementation
- Product CRUD operations
- Integration with backend API
- Photo association with products

#### Features
- Create products
- Update products
- Delete products
- Associate photos with products
- Search and filter products

#### Components
- `ProductForm` - Product creation/editing
- `ProductList` - Product browsing
- `ProductService` - Product management logic

## App Structure

### Main Pages
1. **Auth Page** - Login/Signup
2. **Dashboard** - Main overview
3. **Products** - Product management
4. **Photos** - Photo gallery
5. **Profile** - User profile

### Navigation Structure
```
App
├── Auth Page
│   ├── Login
│   └── Google Login
├── Dashboard
│   ├── Products
│   ├── Photos
│   └── Profile
├── Products
│   ├── Product List
│   ├── Product Detail
│   ├── Add Product
│   └── Edit Product
├── Photos
│   ├── Photo Gallery
│   ├── Upload Photo
│   └── Photo Detail
└── Profile
    ├── Profile Info
    ├── Settings
    └── Logout
```

## Implementation Details

### Authentication Flow
```typescript
// AuthService.ts
class AuthService {
  async signInWithGoogle() {
    // Use Supabase OAuth provider
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: CAPACITOR_DEEPLINK_URL
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  async handleAuthCallback() {
    // Handle OAuth callback from deep link
    const session = await supabase.auth.getSession();
    // Store tokens securely
    await SecureStorage.set('access_token', session.access_token);
    await SecureStorage.set('refresh_token', session.refresh_token);
  }
}
```

### Photo Upload Component
```typescript
// PhotoUpload.tsx
const PhotoUpload = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert file to base64 or blob for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      setPhoto(e.target.result);
      // Upload to Supabase Storage
      await uploadPhoto(file);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`${Date.now()}_${file.name}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {photo && <img src={photo} alt="Uploaded" />}
    </div>
  );
};
```

### QR Generator Component
```typescript
// QRGenerator.tsx
import QRCode from 'qrcode.react';

const QRGenerator = ({ value }) => {
  return (
    <div>
      <QRCode value={value} size={256} />
      <p>{value}</p>
    </div>
  );
};
```

## Web Configuration

### Key Dependencies
```bash
npm install next react react-dom @supabase/supabase-js
```

## Offline Capability

### Data Synchronization
- Browser storage using localStorage/sessionStorage
- Sync with Supabase when online
- Conflict resolution strategies
- Offline support for critical features using Service Workers

### Implementation
```typescript
// OfflineService.ts
class OfflineService {
  async syncData() {
    if (navigator.onLine) {
      // Sync local data with Supabase
      await this.uploadLocalChanges();
      await this.downloadRemoteChanges();
    }
  }

  async uploadLocalChanges() {
    // Upload locally stored data to Supabase
    // Handle conflicts if needed
  }

  async downloadRemoteChanges() {
    // Download latest data from Supabase
    // Update local storage
  }
}
```

## Security Considerations

### Authentication Security
- Secure token storage in browser localStorage/sessionStorage
- Token refresh mechanisms
- Session management
- Secure cookie handling

### Data Security
- Encryption for sensitive data
- Secure communication with backend
- Input validation
- Secure file uploads

## Performance Optimization

### Image Optimization
- Compress images before upload
- Use appropriate image formats
- Implement lazy loading
- Cache images locally

### App Bundle Optimization
- Tree shaking
- Code splitting
- Lazy loading of pages
- Optimize dependencies

## Testing Strategy

### Unit Tests
- Component tests using Jest
- Service tests
- Utility function tests

### Integration Tests
- Authentication flow tests
- API integration tests
- Offline functionality tests

### End-to-End Tests
- User journey tests
- Cross-platform tests
- Device-specific tests

## Deployment

### Build Process
```bash
# Build web version
cd smarter-ionic
pnpm run build

# Add native platforms
npx cap add android
npx cap add ios

# Sync web assets to native platforms
npx cap sync

# Open native IDEs
npx cap open android
npx cap open ios
```

### App Store Submission
- Generate signed APK for Android
- Generate IPA for iOS
- Prepare store listings
- Submit to app stores

This design provides a comprehensive framework for the mobile application with all requested features while maintaining security, performance, and usability standards.