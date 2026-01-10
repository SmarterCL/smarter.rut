// src/services/mcp-service.ts
// MCP (Motor de Control de Plataforma) Service for Ionic

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

class MCPService {
  private supabase: SupabaseClient | null = null;
  private mcpBaseUrl: string;

  constructor() {
    // Use the same environment variables as the main app
    this.mcpBaseUrl = import.meta.env.VITE_MCP_BASE_URL || import.meta.env.VITE_MCP_BASE_URL || 'http://localhost:3002';
    
    // Initialize Supabase client if credentials are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('demo.supabase.co')) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      // Create a mock client for local development
      this.supabase = {
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ error: null }),
          update: () => Promise.resolve({ error: null }),
          eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) })
        })
      } as any;
    }
  }

  /**
   * Execute a command through MCP
   */
  async executeCommand(command: string, params: any = {}): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.mcpBaseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mcp-token') || 'demo-token'}`
        },
        body: JSON.stringify({ 
          command, 
          params,
          timestamp: new Date().toISOString(),
          source: 'ionic-app'
        })
      });

      if (!response.ok) {
        throw new Error(`MCP Error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get objects from MCP
   */
  async getObjects(tenantId: string, filters: any = {}) {
    return await this.executeCommand('get_objects', { 
      tenant_id: tenantId,
      filters 
    });
  }

  /**
   * Create object through MCP
   */
  async createObject(prompt: string, tenantId: string, metadata: any = {}) {
    return await this.executeCommand('create_object', { 
      prompt, 
      tenant_id: tenantId,
      metadata
    });
  }

  /**
   * Get user metrics from MCP
   */
  async getUserMetrics(userId: string) {
    return await this.executeCommand('get_user_metrics', { user_id: userId });
  }

  /**
   * Log event to MCP
   */
  async logEvent(eventType: string, eventData: any, userId?: string) {
    return await this.executeCommand('log_event', { 
      event_type: eventType,
      event_data: eventData,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get tenant information
   */
  async getTenantInfo(tenantId: string) {
    return await this.executeCommand('get_tenant_info', { tenant_id: tenantId });
  }

  /**
   * Execute payment operation
   */
  async processPayment(paymentData: any, tenantId: string) {
    return await this.executeCommand('process_payment', { 
      payment_data: paymentData,
      tenant_id: tenantId
    });
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(tenantId: string) {
    return await this.executeCommand('get_subscription_status', { tenant_id: tenantId });
  }
}

export const mcpService = new MCPService();
export type { MCPResponse };