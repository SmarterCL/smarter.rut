# Supabase Backend Implementation

## Overview
This document outlines the implementation of a Supabase backend that serves the web (Next.js) application for the SmarterBOT platform.

## Database Schema

### Users Table
```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  rut TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Products Table
```sql
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  qr_code TEXT UNIQUE,
  nfc_tag_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);
```

### QR Codes Table
```sql
CREATE TABLE public.qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  product_id UUID REFERENCES public.products,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own QR codes" ON public.qr_codes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own QR codes" ON public.qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own QR codes" ON public.qr_codes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own QR codes" ON public.qr_codes
  FOR DELETE USING (auth.uid() = user_id);
```

### NFC Tags Table
```sql
CREATE TABLE public.nfc_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  product_id UUID REFERENCES public.products,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nfc_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own NFC tags" ON public.nfc_tags
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own NFC tags" ON public.nfc_tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own NFC tags" ON public.nfc_tags
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own NFC tags" ON public.nfc_tags
  FOR DELETE USING (auth.uid() = user_id);
```

### Photo Storage
```sql
-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', false);

-- Create policies for photo storage
CREATE POLICY "Users can upload own photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.uid() = owner);

CREATE POLICY "Users can update own photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photos' AND auth.uid() = owner);

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos' AND auth.uid() = owner);

CREATE POLICY "Users can read own photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos' AND auth.uid() = owner);
```

### Scanning History Table
```sql
CREATE TABLE public.scanning_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  scan_type TEXT CHECK (scan_type IN ('qr', 'nfc', 'photo')) NOT NULL,
  scan_content TEXT NOT NULL,
  product_id UUID REFERENCES public.products,
  scan_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.scanning_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scan history" ON public.scanning_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scan history" ON public.scanning_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Supabase Configuration

### Environment Variables
```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Client Setup
```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Service Layer Implementation

#### User Service
```typescript
// services/userService.ts
import { supabase } from '../lib/supabaseClient';

export class UserService {
  static async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async updateProfile(profile: Partial<{
    first_name: string;
    last_name: string;
    avatar_url: string;
    rut: string;
    phone: string;
  }>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async uploadAvatar(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    // Update profile with avatar URL
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);
    
    return await this.updateProfile({ avatar_url: publicUrl });
  }
}
```

#### Product Service
```typescript
// services/productService.ts
import { supabase } from '../lib/supabaseClient';

export class ProductService {
  static async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        qr_codes ( code ),
        nfc_tags ( tag_id )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async getById(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        qr_codes ( code ),
        nfc_tags ( tag_id )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async create(product: {
    name: string;
    description?: string;
    photo_url?: string;
    qr_code?: string;
    nfc_tag_id?: string;
    metadata?: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Generate QR code if not provided
    if (!product.qr_code) {
      product.qr_code = `QR${Date.now()}`;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async update(id: string, updates: Partial<{
    name: string;
    description: string;
    photo_url: string;
    metadata: any;
  }>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async delete(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) throw error;
  }
  
  static async uploadProductPhoto(productId: string, file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Verify product belongs to user
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single();
    
    if (productError || !product) throw new Error('Product not found or access denied');
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/products/${productId}/photo.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    // Get public URL and update product
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);
    
    return await this.update(productId, { photo_url: publicUrl });
  }
}
```

#### QR Code Service
```typescript
// services/qrCodeService.ts
import { supabase } from '../lib/supabaseClient';

export class QRCodeService {
  static async create(content: string, productId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const code = `QR${Date.now()}`;
    
    const { data, error } = await supabase
      .from('qr_codes')
      .insert([{
        code,
        content,
        product_id: productId,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getByCode(code: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        products ( id, name, description, photo_url )
      `)
      .eq('code', code)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async scanQRCode(code: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Record scan in history
    await supabase
      .from('scanning_history')
      .insert([{
        user_id: user.id,
        scan_type: 'qr',
        scan_content: code,
        scan_metadata: { timestamp: new Date().toISOString() }
      }]);
    
    // Get the QR code details
    return await this.getByCode(code);
  }
}
```

#### NFC Service
```typescript
// services/nfcService.ts
import { supabase } from '../lib/supabaseClient';

export class NFCService {
  static async create(content: string, tagId: string, productId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('nfc_tags')
      .insert([{
        tag_id: tagId,
        content,
        product_id: productId,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getByTagId(tagId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('nfc_tags')
      .select(`
        *,
        products ( id, name, description, photo_url )
      `)
      .eq('tag_id', tagId)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async scanNFCTag(tagId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Record scan in history
    await supabase
      .from('scanning_history')
      .insert([{
        user_id: user.id,
        scan_type: 'nfc',
        scan_content: tagId,
        scan_metadata: { timestamp: new Date().toISOString() }
      }]);
    
    // Get the NFC tag details
    return await this.getByTagId(tagId);
  }
}
```

## Real-time Subscriptions

### Setup Real-time Listeners
```typescript
// services/realtimeService.ts
import { supabase } from '../lib/supabaseClient';

export class RealtimeService {
  static subscribeToProductChanges(
    userId: string, 
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }
  
  static subscribeToQRScans(
    userId: string,
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel('qr-scans')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scanning_history',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }
}
```

## Supabase Functions (Edge Functions)

### Generate QR Code Function
```typescript
// supabase/functions/generate-qr/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { QRCode } from 'https://esm.sh/qrcode@1.5.3';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { content, size = 200 } = await req.json();
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return new Response(JSON.stringify({ qrCode }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

### Process Uploaded Photo
```typescript
// supabase/functions/process-photo/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { filePath, userId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    // Process the image (resize, optimize, etc.)
    // This would typically involve image processing libraries
    
    // Update the product with the processed image URL
    // ... processing logic here ...
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

## Authentication Configuration

### Google OAuth Setup
```sql
-- Configure Google OAuth in Supabase
-- This is typically done in the Supabase dashboard
-- But here's the SQL to ensure proper setup

-- Ensure auth schema is properly configured
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO service_role;

-- Enable Google provider
-- This is done in the dashboard: Authentication → Settings → External OAuth providers
```

### Row Level Security Policies
```sql
-- Ensure RLS is properly configured for all tables
-- Already defined in the table creation scripts above
```

## Database Functions

### Helper Functions
```sql
-- Function to generate unique QR codes
CREATE OR REPLACE FUNCTION generate_unique_qr_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'QR' || FLOOR(RANDOM() * 1000000000)::TEXT;
    SELECT EXISTS(
      SELECT 1 FROM qr_codes WHERE code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$;

-- Function to generate unique NFC tag IDs
CREATE OR REPLACE FUNCTION generate_unique_nfc_tag()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_tag TEXT;
  tag_exists BOOLEAN;
BEGIN
  LOOP
    new_tag := 'NFC' || FLOOR(RANDOM() * 1000000000)::TEXT;
    SELECT EXISTS(
      SELECT 1 FROM nfc_tags WHERE tag_id = new_tag
    ) INTO tag_exists;
    
    IF NOT tag_exists THEN
      RETURN new_tag;
    END IF;
  END LOOP;
END;
$$;
```

## Migration Scripts

### Initial Setup Script
```sql
-- migrations/01_setup_schema.sql
-- This script sets up the initial database schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tables (as defined above)
-- ... (include all table definitions from above)

-- RLS Policies (as defined above)
-- ... (include all policy definitions from above)

-- Functions (as defined above)
-- ... (include all function definitions from above)

-- Storage configuration
-- ... (include storage setup from above)
```

### Data Seeding Script
```sql
-- migrations/02_seed_data.sql
-- This script seeds initial data for testing

-- Insert sample users (this would typically be done through auth)
-- Insert sample products
INSERT INTO products (id, user_id, name, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Sample Product 1', 'This is a sample product', NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Sample Product 2', 'This is another sample product', NOW(), NOW());
```

## Performance Optimization

### Database Indexes
```sql
-- Create indexes for better performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_code ON qr_codes(code);
CREATE INDEX idx_nfc_tags_user_id ON nfc_tags(user_id);
CREATE INDEX idx_nfc_tags_tag_id ON nfc_tags(tag_id);
CREATE INDEX idx_scanning_history_user_id ON scanning_history(user_id);
CREATE INDEX idx_scanning_history_created_at ON scanning_history(created_at DESC);
```

### Query Optimization
```typescript
// Use efficient queries with proper select statements
// Example: Only select needed fields
const { data, error } = await supabase
  .from('products')
  .select('id, name, description, photo_url, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Use proper filtering
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('user_id', userId)
  .ilike('name', `%${searchTerm}%`) // Case-insensitive search
  .limit(20); // Limit results
```

This implementation provides a robust, scalable, and secure Supabase backend that serves the web application with proper authentication, authorization, and data management.