import { supabase } from './supabaseClient';

class McpService {
    constructor() {
        this.mcpUrl = process.env.NEXT_PUBLIC_MCP_URL || 'https://n8n.smarterbot.store/mcp-server/http';
        this.projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'rjfcmmzjlguiititkmyh';
        this.protocol = 'MCP-2.0';
    }

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }

    async execute(command, params = {}) {
        const session = await this.getSession();
        if (!session) {
            console.warn('No active session for MCP execution');
        }

        try {
            const response = await fetch(`${this.mcpUrl}/execute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                    'X-Project-Ref': this.projectRef
                },
                body: JSON.stringify({
                    command,
                    params,
                    protocol: this.protocol,
                    source: 'rut-web-app'
                })
            });

            if (!response.ok) {
                throw new Error(`MCP Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('MCP Execution failed:', error);
            return { error: error.message };
        }
    }

    async logEvent(eventType, payload = {}) {
        return this.execute('log_event', {
            event_type: eventType,
            ...payload
        });
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.mcpUrl}/health`, {
                headers: {
                    'X-Project-Ref': this.projectRef
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Domain specific methods
    async syncDatabase() {
        return this.execute('sync_database', { target: 'supabase' });
    }

    async startService(service) {
        return this.execute('start_service', { service });
    }
}

export const mcpService = new McpService();
