// src/services/chat-service.ts
// Servicio de chat para comunicación con MCP a través del backend

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'mcp';
  timestamp: Date;
  data?: any;
}

interface ChatResponse {
  success: boolean;
  data?: any;
  error?: string;
  endpoint?: string;
}

class ChatService {
  private backendUrl: string;
  private mcpBaseUrl: string;

  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    this.mcpBaseUrl = import.meta.env.VITE_MCP_BASE_URL || 'http://localhost:3002';
  }

  /**
   * Enviar mensaje al backend para procesamiento MCP
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Determinar endpoint basado en el contenido del mensaje
      let endpoint = 'health'; // default
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('cliente') || lowerMsg.includes('users') || lowerMsg.includes('usuarios')) {
        endpoint = 'clientes';
      } else if (lowerMsg.includes('pago') || lowerMsg.includes('payment') || lowerMsg.includes('transaccion')) {
        endpoint = 'pagos';
      } else if (lowerMsg.includes('orden') || lowerMsg.includes('order') || lowerMsg.includes('pedido')) {
        endpoint = 'ordenes';
      } else if (lowerMsg.includes('health') || lowerMsg.includes('estado') || lowerMsg.includes('status')) {
        endpoint = 'health';
      } else if (lowerMsg.includes('metric') || lowerMsg.includes('kpi') || lowerMsg.includes('metrica')) {
        endpoint = 'metrics';
      }

      // Enviar solicitud al backend
      const response = await fetch(`${this.backendUrl}/api/mcp/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mcp-token') || 'demo-token'}`
        },
        body: JSON.stringify({ 
          command: message,
          endpoint: endpoint,
          timestamp: new Date().toISOString(),
          source: 'ionic-chat'
        })
      });

      if (!response.ok) {
        throw new Error(`Chat Error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        endpoint: endpoint
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        endpoint: 'error'
      };
    }
  }

  /**
   * Enviar comando directo a MCP
   */
  async executeMCPCommand(command: string, params: any = {}) {
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
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`MCP Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('MCP Command Error:', error);
      return { error: error.message };
    }
  }

  /**
   * Obtener datos de KPIs comerciales desde PostgreSQL
   */
  async getBusinessKPIs(tenantId: string) {
    return await this.executeMCPCommand('get_business_kpis', { tenant_id: tenantId });
  }

  /**
   * Obtener métricas de usuario
   */
  async getUserMetrics(userId: string) {
    return await this.executeMCPCommand('get_user_metrics', { user_id: userId });
  }
}

export const chatService = new ChatService();
export type { ChatMessage, ChatResponse };