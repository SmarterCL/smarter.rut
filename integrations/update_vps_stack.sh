#!/bin/bash

# Script de actualización para el VPS
# Uso: bash update_stack.sh

echo "🔄 Iniciando actualización de integración MCP-Supabase..."

# 1. Crear directorio de integración
mkdir -p /root/ide-mcp-integration

# 2. Crear archivo de configuración
cat > /root/ide-mcp-integration/supabase-mcp-config.json << 'EOF'
{
  "mcpSupabaseIntegration": {
    "supabase": {
      "projectRef": "rjfcmmzjlguiititkmyh",
      "url": "https://mcp.supabase.com",
      "features": ["docs", "account", "database", "debugging", "development", "functions", "branching", "storage"]
    },
    "mcpServer": {
      "url": "https://n8n.smarterbot.store/mcp-server/http",
      "token": "YOUR_MCP_TOKEN_HERE",
      "protocol": "MCP-2.0"
    },
    "integration": {
      "auth": {
        "type": "supabase-jwt",
        "provider": "supabase",
        "redirect": "https://rut.smarterbot.store/login"
      },
      "services": {
        "odoo": "odoo-backend:8069",
        "n8n": "n8n-backend:5678",
        "chatwoot": "chatwoot-backend:3000",
        "mcp": "internal-mcp:8000"
      }
    }
  }
}
EOF

# 3. Actualizar Caddyfile
echo "📝 Actualizando Caddyfile..."
docker exec caddy-edge-tls bash -c 'cat > /etc/caddy/Caddyfile' << 'EOF'
{
    email smarterbotc@gmail.com
}

# Ruta para MCP server con integración Supabase
n8n.smarterbot.store {
    handle /mcp-server* {
        reverse_proxy internal-mcp:8000 {
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote}
            header_up X-Forwarded-For {remote}
            header_up X-Project-Ref rjfcmmzjlguiititkmyh
        }
    }
    reverse_proxy n8n-backend:5678
}

# Ruta para RUT login
rut.smarterbot.store {
    reverse_proxy internal-mcp:8000 {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
    }
}

# Rutas genéricas
*.smarterbot.store {
    reverse_proxy internal-mcp:8000 {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
    }
}

*.smarterbot.cl {
    reverse_proxy internal-mcp:8000 {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
    }
}

# Dominios específicos
smarterbot.store {
    handle /privacy* {
        root * /usr/share/caddy/privacy.html
        file_server
    }
    reverse_proxy internal-mcp:8000
}

smarterbot.cl {
    handle /privacy* {
        root * /usr/share/caddy/privacy.html
        file_server
    }
    reverse_proxy internal-mcp:8000
}

odoo.smarterbot.store {
    reverse_proxy odoo-backend:8069
}

chatwoot.smarterbot.cl {
    reverse_proxy chatwoot-backend:3000
}
EOF

# 4. Recargar Caddy
echo "🚀 Recargando Caddy..."
docker exec caddy-edge-tls caddy reload

echo "✅ Actualización completada."
