# Mobile App Design: SmarterBOT Ionic Application

## Overview
This document outlines the design for the SmarterBOT mobile application built with Ionic, featuring photo capture, QR code scanning, NFC functionality, and Google login integration.

## App Architecture

### Technology Stack
- **Framework**: Ionic React
- **Runtime**: Capacitor
- **State Management**: React Hooks + Context API
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase (offline-first with sync)
- **UI Components**: Ionic UI components

### Core Features
1. Google OAuth Login
2. Photo Capture and Management
3. QR Code Scanning and Generation
4. NFC Tag Reading and Writing
5. Product Management
6. Offline Capability

## Feature Design

### 1. Google OAuth Login

#### Implementation
- Use Supabase Auth with Google provider
- Deep linking for OAuth redirect
- Secure token storage using Capacitor Secure Storage

#### User Flow
1. User opens app
2. Taps "Sign in with Google" button
3. Redirected to Google OAuth
4. User authenticates with Google
5. Redirected back to app with tokens
6. Supabase creates/links user account
7. User enters main app

#### Components
- `GoogleAuthButton` - Custom component for Google login
- `AuthService` - Handles authentication logic
- `SecureStorageService` - Secure token storage

### 2. Photo Capture and Management

#### Implementation
- Capacitor Camera plugin for photo capture
- Supabase Storage for photo uploads
- Local caching for offline access

#### Features
- Capture new photos
- Select from gallery
- Upload to Supabase Storage
- View and manage photos
- Offline photo access

#### Components
- `PhotoCapture` - Camera interface
- `PhotoGallery` - Photo browsing
- `PhotoUploadService` - Upload management
- `OfflinePhotoCache` - Local storage for offline access

### 3. QR Code Scanning and Generation

#### Implementation
- Capacitor Barcode Scanner plugin for scanning
- QR code generation using library
- Integration with backend API

#### Features
- Scan QR codes
- Generate QR codes for products
- Link QR codes to products
- History of scanned codes

#### Components
- `QRScanner` - Camera-based scanner
- `QRGenerator` - QR code generation
- `QRScannerService` - Scanning logic
- `QRHistory` - History of scanned codes

### 4. NFC Functionality

#### Implementation
- Capacitor NFC plugin
- Reading and writing NFC tags
- Linking NFC tags to products

#### Features
- Read NFC tags
- Write to NFC tags
- Link NFC tags to products
- History of NFC interactions

#### Components
- `NFCReader` - NFC reading interface
- `NFCWriter` - NFC writing interface
- `NFCService` - NFC logic management
- `NFCHistory` - History of NFC interactions

## App Structure

### Main Pages
1. **Auth Page** - Login/Signup
2. **Dashboard** - Main overview
3. **Products** - Product management
4. **Scanner** - QR/NFC scanning
5. **Photos** - Photo gallery
6. **Profile** - User profile

### Navigation Structure
```
App
├── Auth Page
│   ├── Login
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
│   ├── NFC Reader
│   └── Scanner History
├── Photos
│   ├── Photo Gallery
│   ├── Capture Photo
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

### Photo Capture Component
```typescript
// PhotoCapture.tsx
const PhotoCapture = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  
  const capturePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      saveToGallery: true
    });
    
    setPhoto(image.webPath);
    // Upload to Supabase Storage
    await uploadPhoto(image);
  };
  
  const uploadPhoto = async (image: CameraPhoto) => {
    // Convert to blob and upload
    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`${Date.now()}.jpg`, blob, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    return data;
  };
  
  return (
    <IonPage>
      <IonContent>
        <IonButton onClick={capturePhoto}>
          Capture Photo
        </IonButton>
        {photo && <img src={photo} alt="Captured" />}
      </IonContent>
    </IonPage>
  );
};
```

### QR Scanner Component
```typescript
// QRScanner.tsx
const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  
  const startScan = async () => {
    setScanning(true);
    
    try {
      const result = await BarcodeScanner.scanBarcode();
      if (result.hasContent) {
        // Process the scanned content
        processScannedContent(result.content);
      }
    } catch (error) {
      console.error('Error scanning:', error);
    } finally {
      setScanning(false);
    }
  };
  
  const processScannedContent = async (content: string) => {
    // Handle the scanned content
    // Could be a product ID, URL, etc.
    if (content.startsWith('https://smarterbot.store/product/')) {
      const productId = content.split('/').pop();
      // Navigate to product detail
      navigate(`/products/${productId}`);
    }
  };
  
  return (
    <IonPage>
      <IonContent>
        <IonButton onClick={startScan} disabled={scanning}>
          {scanning ? 'Scanning...' : 'Scan QR Code'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
```

### NFC Component
```typescript
// NFCReader.tsx
const NFCReader = () => {
  const [nfcEnabled, setNfcEnabled] = useState(false);
  
  useEffect(() => {
    const initNFC = async () => {
      try {
        await NFC.writePermission();
        setNfcEnabled(true);
        
        // Start listening for NFC tags
        const listener = NFC.addListener('tag', (event) => {
          handleNFCTag(event.tag);
        });
        
        return () => listener.remove();
      } catch (error) {
        console.error('NFC not supported:', error);
      }
    };
    
    initNFC();
  }, []);
  
  const handleNFCTag = async (tag: any) => {
    // Process NFC tag
    const content = tag.ndefMessage[0]?.payload;
    if (content) {
      // Process the NFC content
      processNFCContent(content);
    }
  };
  
  const processNFCContent = async (content: string) => {
    // Handle NFC content
    // Could be a product ID, URL, etc.
    console.log('NFC content:', content);
  };
  
  return (
    <IonPage>
      <IonContent>
        <IonLabel>
          NFC Status: {nfcEnabled ? 'Enabled' : 'Disabled'}
        </IonLabel>
        <IonNote>
          Hold your device near an NFC tag
        </IonNote>
      </IonContent>
    </IonPage>
  );
};
```

## Capacitor Configuration

### Required Plugins
```bash
npm install @capacitor/app
npm install @capacitor/haptics
npm install @capacitor/keyboard
npm install @capacitor/status-bar
npm install @capacitor/camera
npm install @capacitor/barcode-scanner
npm install @capacitor/nfc
npm install @capacitor/preferences
```

### Android Configuration (capacitor.config.ts)
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smarterbot.app',
  appName: 'SmarterBOT',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BarcodeScanner: {
      formats: ['QR_CODE', 'CODE_128', 'EAN_13'],
    },
    NFC: {
      // NFC configuration
    }
  }
};

export default config;
```

## Offline Capability

### Data Synchronization
- Local SQLite database using Capacitor Community SQLite plugin
- Sync with Supabase when online
- Conflict resolution strategies
- Offline-first approach for critical features

### Implementation
```typescript
// OfflineService.ts
class OfflineService {
  async syncData() {
    const online = await Network.getStatus();
    if (online.connected) {
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
- Secure token storage using Capacitor Secure Storage
- Token refresh mechanisms
- Session management
- Biometric authentication (optional)

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