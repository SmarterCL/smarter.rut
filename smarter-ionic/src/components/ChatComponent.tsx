// src/components/ChatComponent.tsx
// Componente de chat para Ionic que se comunica con MCP

import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonListHeader,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from '@ionic/react';
import { chatService } from '../services/chat-service';
import { useAuth } from '../services/auth-provider';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'mcp';
  timestamp: Date;
  data?: any;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Enviar mensaje al servicio de chat
      const response = await chatService.sendMessage(inputText);
      
      // Agregar respuesta del MCP
      const mcpMessage: ChatMessage = {
        id: `mcp-${Date.now()}`,
        text: response.success 
          ? `MCP Response (${response.endpoint}): ${JSON.stringify(response.data, null, 2)}` 
          : `Error: ${response.error}`,
        sender: 'mcp',
        timestamp: new Date(),
        data: response.data
      };

      setMessages(prev => [...prev, mcpMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: `Error connecting to MCP: ${(error as Error).message}`,
        sender: 'mcp',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickCommands = [
    { label: 'Clientes', command: 'clientes' },
    { label: 'Pagos', command: 'pagos' },
    { label: 'Ordenes', command: 'ordenes' },
    { label: 'Estado', command: 'health' },
    { label: 'Métricas', command: 'metrics' },
    { label: 'KPIs', command: 'kpis' }
  ];

  const handleQuickCommand = (command: string) => {
    setInputText(command);
    setTimeout(() => handleSendMessage(), 100); // Pequeño delay para que se actualice el input
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonListHeader>
          <IonLabel>
            <h2>Chat con MCP</h2>
            <p>Comunícate con el Motor de Control de Plataforma</p>
          </IonLabel>
        </IonListHeader>

        <IonList>
          {/* Mensajes del chat */}
          {messages.map((msg) => (
            <IonItem key={msg.id} lines="none">
              <IonIcon
                icon={msg.sender === 'user' ? 'person' : 'chatbubble'}
                slot="start"
                color={msg.sender === 'user' ? 'primary' : 'tertiary'}
              />
              <IonLabel>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <IonBadge color={msg.sender === 'user' ? 'primary' : 'tertiary'}>
                    {msg.sender === 'user' ? 'Tú' : 'MCP'}
                  </IonBadge>
                  <small>{msg.timestamp.toLocaleTimeString()}</small>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
                  {msg.text}
                </div>
              </IonLabel>
            </IonItem>
          ))}
          {isLoading && (
            <IonItem>
              <IonIcon icon={chatbubble} slot="start" color="medium" />
              <IonLabel>
                <IonBadge color="warning">Procesando...</IonBadge>
              </IonLabel>
            </IonItem>
          )}
          <div ref={messagesEndRef} />
        </IonList>

        {/* Comandos rápidos */}
        <IonGrid>
          <IonRow>
            {quickCommands.map((cmd, index) => (
              <IonCol size="4" key={index}>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  expand="block"
                  onClick={() => handleQuickCommand(cmd.command)}
                >
                  {cmd.label}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Input de texto */}
        <IonItem>
          <IonTextarea
            value={inputText}
            onIonInput={(e) => setInputText(e.detail.value!)}
            placeholder="Escribe un comando para MCP..."
            onKeyPress={handleKeyPress}
            rows={2}
          />
          <IonButton
            slot="end"
            fill="clear"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <IonIcon icon="send" />
          </IonButton>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default ChatComponent;