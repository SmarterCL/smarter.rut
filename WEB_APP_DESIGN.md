# Web App Design: SmarterBOT Next.js Application

## Overview
This document outlines the design for the SmarterBOT web application built with Next.js, featuring photo capture, QR code scanning, and Google login integration with shared authentication between web and mobile platforms.

## App Architecture

### Technology Stack
- **Framework**: Next.js 13+ with App Router
- **Runtime**: Node.js / Vercel Edge Runtime
- **State Management**: React Hooks + Context API / Zustand
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **UI Components**: React Bootstrap + Custom Components
- **Styling**: Tailwind CSS / Styled Components

### Core Features
1. Google OAuth Login
2. Photo Capture and Management
3. QR Code Scanning and Generation
4. Product Management
5. Responsive Design for all devices
6. Progressive Web App (PWA) capabilities

## Feature Design

### 1. Google OAuth Login

#### Implementation
- Use Supabase Auth with Google provider
- Next.js API routes for authentication
- Secure session management
- JWT token handling

#### User Flow
1. User visits website
2. Taps "Sign in with Google" button
3. Redirected to Google OAuth
4. User authenticates with Google
5. Redirected back to web app with tokens
6. Supabase creates/links user account
7. User enters main app with authenticated session

#### Components
- `GoogleAuthButton` - Custom component for Google login
- `AuthService` - Handles authentication logic
- `AuthContext` - Global authentication state
- `ProtectedRoute` - HOC for protected routes

### 2. Photo Capture and Management

#### Implementation
- HTML5 File API for photo capture
- Drag and drop upload interface
- Supabase Storage for photo uploads
- Client-side image processing

#### Features
- Capture from webcam
- Upload from device
- Drag and drop interface
- Image preview and editing
- Upload to Supabase Storage
- View and manage photos
- Responsive image display

#### Components
- `PhotoCapture` - Webcam interface
- `FileUpload` - Drag and drop upload
- `ImageEditor` - Client-side editing
- `PhotoGallery` - Photo browsing
- `PhotoUploadService` - Upload management

### 3. QR Code Scanning and Generation

#### Implementation
- Client-side QR scanning using libraries
- QR code generation using libraries
- Integration with backend API
- Camera access for scanning

#### Features
- Scan QR codes using webcam
- Generate QR codes for products
- Link QR codes to products
- History of scanned codes
- QR code validation

#### Components
- `QRScanner` - Webcam-based scanner
- `QRGenerator` - QR code generation
- `QRScannerService` - Scanning logic
- `QRHistory` - History of scanned codes

## App Structure

### Main Pages
1. **Home** - Landing page
2. **Auth** - Login/Signup
3. **Dashboard** - Main overview
4. **Products** - Product management
5. **Scanner** - QR scanning
6. **Photos** - Photo gallery
7. **Profile** - User profile
8. **Settings** - App settings

### Navigation Structure
```
App
├── Home Page
├── Auth Pages
│   ├── Login
│   ├── Signup
│   └── Google Login
├── Dashboard
│   ├── Products
│   ├── Scanner
│   ├── Photos
│   └── Profile
├── Products
│   ├── Product List
│   ├── Product Detail
│   ├── Add Product
│   └── Edit Product
├── Scanner
│   ├── QR Scanner
│   └── Scanner History
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
// services/authService.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

class AuthService {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  
  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
```

### Auth Context
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = authService.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
          setLoading(false);
        }
      );
      
      return () => subscription.unsubscribe();
    };
    
    getInitialSession();
  }, []);
  
  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };
  
  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Photo Upload Component
```typescript
// components/PhotoUpload.tsx
import { useState, useRef, ChangeEvent } from 'react';
import { supabase } from '../services/supabaseClient';

const PhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Upload to Supabase
      uploadFile(file);
    }
  };
  
  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(`${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Update user's photo record in database
      // ... additional logic
      
      alert('Photo uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading photo:', error.message);
      alert('Error uploading photo');
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="photo-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <button
        onClick={triggerFileSelect}
        disabled={uploading}
        className="btn btn-primary"
      >
        {uploading ? 'Uploading...' : 'Select Photo'}
      </button>
      
      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
```

### QR Scanner Component
```typescript
// components/QRScanner.tsx
import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  
  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);
  
  const startScanning = async () => {
    if (!videoRef.current) return;
    
    setScanning(true);
    setResult(null);
    
    try {
      await codeReader.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            setResult(result.getText());
            setScanning(false);
            codeReader.current?.reset();
          }
        }
      );
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      setScanning(false);
    }
  };
  
  const stopScanning = () => {
    setScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };
  
  return (
    <div className="qr-scanner">
      <div className="scanner-controls">
        {!scanning ? (
          <button onClick={startScanning} className="btn btn-primary">
            Start QR Scan
          </button>
        ) : (
          <button onClick={stopScanning} className="btn btn-secondary">
            Stop Scan
          </button>
        )}
      </div>
      
      <div className="scanner-view">
        <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
      </div>
      
      {result && (
        <div className="scan-result">
          <h4>Scanned Result:</h4>
          <p>{result}</p>
          <button 
            onClick={() => navigator.clipboard.writeText(result)}
            className="btn btn-sm btn-outline-primary"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
```

### QR Generator Component
```typescript
// components/QRGenerator.tsx
import { useState } from 'react';
import QRCode from 'qrcode.react';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(128);
  
  return (
    <div className="qr-generator">
      <div className="form-group">
        <label htmlFor="qr-text">Text to encode:</label>
        <input
          type="text"
          id="qr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder="Enter text or URL"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="qr-size">Size:</label>
        <input
          type="range"
          id="qr-size"
          min="64"
          max="300"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="form-control"
        />
        <span>{size}px</span>
      </div>
      
      {text && (
        <div className="qr-display">
          <QRCode 
            value={text} 
            size={size}
            level="H"
            includeMargin={true}
          />
          <div className="qr-actions">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
```

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Components
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly interfaces
- Optimized images for different screen sizes

## Progressive Web App (PWA)

### Features
- Installable on devices
- Offline capability
- Push notifications
- Fast loading
- Native app-like experience

### Implementation
- Web App Manifest
- Service Worker for caching
- Offline-first approach for critical features
- Background sync capabilities

## Security Considerations

### Authentication Security
- Secure token handling
- CSRF protection
- Input validation
- Rate limiting

### Data Security
- HTTPS enforcement
- Data encryption in transit
- Secure API endpoints
- Input sanitization

## Performance Optimization

### Image Optimization
- Next.js Image component
- WebP format support
- Lazy loading
- Responsive images

### Code Splitting
- Dynamic imports
- Route-based splitting
- Component lazy loading
- Bundle optimization

### Caching Strategy
- HTTP caching headers
- CDN for static assets
- Service worker caching
- Database query optimization

## API Integration

### Service Layer
```typescript
// services/apiService.ts
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
```

## Testing Strategy

### Unit Tests
- Component tests using Jest and React Testing Library
- Service tests
- Utility function tests

### Integration Tests
- API integration tests
- Authentication flow tests
- Database interaction tests

### End-to-End Tests
- User journey tests using Playwright or Cypress
- Cross-browser tests
- Responsive design tests

## Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build the application
pnpm run build

# Start production server
pnpm run start
```

### Environment Configuration
- Development, staging, and production environments
- Environment-specific configurations
- Secure handling of API keys and secrets

### Hosting
- Deployed on Vercel
- CDN for static assets
- Database hosted on Supabase
- Custom domain configuration

This design provides a comprehensive framework for the web application with all requested features while maintaining security, performance, and usability standards, and ensuring compatibility with the mobile app through shared authentication and backend services.