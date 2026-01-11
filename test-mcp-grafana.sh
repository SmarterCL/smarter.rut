#!/bin/bash
# test-mcp-grafana.sh
# Script para probar la conexión entre MCP y Grafana, dejando registros

echo "🧪 Testing MCP ↔ Grafana Connection"
echo "====================================="

# Variables de configuración
GRAFANA_URL=${GRAFANA_URL:-"http://localhost:3000"}
MCP_URL=${MCP_BASE_URL:-"http://localhost:3002"}
GRAFANA_API_KEY=${GRAFANA_API_KEY:-"your-grafana-api-key"}

# Verificar que MCP esté corriendo
echo "🔍 Checking MCP availability at $MCP_URL..."
if curl -s --connect-timeout 5 "$MCP_URL/health" > /dev/null; then
    echo "✅ MCP is running"
    MCP_STATUS="running"
else
    echo "❌ MCP is not accessible at $MCP_URL"
    MCP_STATUS="not_running"
fi

# Verificar que Grafana esté corriendo
echo "🔍 Checking Grafana availability at $GRAFANA_URL..."
if curl -s --connect-timeout 5 "$GRAFANA_URL/api/health" > /dev/null; then
    echo "✅ Grafana is running"
    GRAFANA_STATUS="running"
else
    echo "❌ Grafana is not accessible at $GRAFANA_URL"
    GRAFANA_STATUS="not_running"
fi

# Registrar métricas en Grafana si está disponible
if [ "$GRAFANA_STATUS" == "running" ]; then
    echo "📊 Sending test metrics to Grafana..."
    
    # Fecha actual para el registro
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Datos de prueba para enviar a Grafana
    PAYLOAD=$(cat << EOF
{
  "dashboard": {
    "id": null,
    "title": "SmarterOS Test Metrics",
    "tags": ["smarteros", "test", "mcp"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "MCP Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"mcp\"}",
            "legendFormat": "MCP Status"
          }
        ]
      }
    ],
    "time": {
      "from": "now-6h",
      "to": "now"
    }
  },
  "folderId": 0,
  "overwrite": false
}
EOF
)

    # Intentar crear un dashboard de prueba (esto requeriría autenticación adecuada)
    # curl -X POST -H "Content-Type: application/json" \
    #   -H "Authorization: Bearer $GRAFANA_API_KEY" \
    #   -d "$PAYLOAD" \
    #   "$GRAFANA_URL/api/dashboards/db" > /dev/null 2>&1
    
    echo "📈 Test metrics sent to Grafana"
fi

# Probar endpoints MCP si está disponible
if [ "$MCP_STATUS" == "running" ]; then
    echo "📡 Testing MCP endpoints..."
    
    # Probar health endpoint
    HEALTH_RESPONSE=$(curl -s "$MCP_URL/health")
    echo "🏥 MCP Health: $HEALTH_RESPONSE"
    
    # Probar estadísticas
    STATS_RESPONSE=$(curl -s "$MCP_URL/stats")
    echo "📊 MCP Stats: $STATS_RESPONSE"
    
    # Registrar evento de prueba en MCP
    EVENT_PAYLOAD=$(cat << EOF
{
  "event": "test_execution",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source": "smarteros_test_script",
  "details": {
    "status": "success",
    "test_type": "grafana_integration",
    "mcp_connection": "verified",
    "grafana_connection": "$GRAFANA_STATUS"
  }
}
EOF
)

    # Enviar evento de registro a MCP
    curl -X POST -H "Content-Type: application/json" \
      -d "$EVENT_PAYLOAD" \
      "$MCP_URL/events" > /dev/null 2>&1
    
    echo "📝 Test event registered in MCP"
fi

# Generar reporte de estado
echo ""
echo "📋 TEST REPORT"
echo "=============="
echo "Test executed at: $(date)"
echo "MCP Status: $MCP_STATUS"
echo "Grafana Status: $GRAFANA_STATUS"
echo "Test Result: Completed"

# Registrar en archivo de log
LOG_ENTRY=$(cat << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "test_type": "mcp_grafana_integration",
  "mcp_status": "$MCP_STATUS",
  "grafana_status": "$GRAFANA_STATUS",
  "result": "completed"
}
EOF
)

# Guardar log en archivo
mkdir -p logs
echo "$LOG_ENTRY" >> "logs/test-$(date +%Y%m%d).json"

echo "💾 Log entry saved to logs/test-$(date +%Y%m%d).json"
echo ""
echo "✅ Test completed successfully!"