import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonBadge,
  IonFooter,
  IonItem,
  IonList,
  IonToast,
  IonLoading
} from '@ionic/react';
import { placeholderImages } from '../utils/placeholders';
import { mcpService } from '../services/mcp-service';
import { useAuth } from '../services/auth-provider';

interface CardItem {
  id: number;
  title: string;
  description: string;
  price: number; // in dollars
  tokens: number;
  imageUrl: string;
  isSelected: boolean;
}

const SelectionPage: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load card data from MCP
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would come from MCP service
        // const response = await mcpService.getObjects(user?.tenant_id || 'default');
        // setCards(response.data || []);

        // For demo purposes, using static data
        const demoCards: CardItem[] = [
          {
            id: 1,
            title: 'Basic Package',
            description: 'Perfect for getting started with our services',
            price: 0, // Free option
            tokens: 500,
            imageUrl: placeholderImages.basicPackage,
            isSelected: false
          },
          {
            id: 2,
            title: 'Premium Package',
            description: 'Advanced features for power users',
            price: 29.99,
            tokens: 0,
            imageUrl: placeholderImages.premiumPackage,
            isSelected: false
          },
          {
            id: 3,
            title: 'Enterprise Package',
            description: 'Complete solution for businesses',
            price: 99.99,
            tokens: 0,
            imageUrl: placeholderImages.enterprisePackage,
            isSelected: false
          },
          {
            id: 4,
            title: 'Starter Kit',
            description: 'Essential tools to begin your journey',
            price: 0, // Free option
            tokens: 500,
            imageUrl: placeholderImages.starterKit,
            isSelected: false
          }
        ];
        setCards(demoCards);
      } catch (error) {
        console.error('Error loading cards:', error);
        setToastMessage('Error loading services');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [user]);

  const toggleSelection = (cardId: number) => {
    setCards(prevCards => 
      prevCards.map(card => {
        if (card.id === cardId) {
          const newSelectedState = !card.isSelected;
          
          // Update selected items list
          if (newSelectedState) {
            const selectedItem = { ...card, isSelected: true };
            setSelectedItems(prev => [...prev, selectedItem]);
            
            // Log selection event to MCP
            mcpService.logEvent('service_selected', {
              service_id: card.id,
              service_name: card.title,
              user_id: user?.id
            }, user?.id);
          } else {
            setSelectedItems(prev => prev.filter(item => item.id !== cardId));
            
            // Log deselection event to MCP
            mcpService.logEvent('service_deselected', {
              service_id: card.id,
              service_name: card.title,
              user_id: user?.id
            }, user?.id);
          }
          
          return { ...card, isSelected: newSelectedState };
        }
        return card;
      })
    );
  };

  const totalTokens = selectedItems.reduce((sum, item) => sum + item.tokens, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Send selected items to MCP for processing
      const checkoutData = {
        items: selectedItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          tokens: item.tokens
        })),
        total_tokens: totalTokens,
        total_price: totalPrice,
        user_id: user?.id,
        timestamp: new Date().toISOString()
      };

      // Process checkout through MCP
      const response = await mcpService.executeCommand('checkout', checkoutData);
      
      if (response.success) {
        setToastMessage('Checkout completed successfully!');
        setShowToast(true);
        
        // Log checkout event to MCP
        mcpService.logEvent('checkout_completed', {
          checkout_data: checkoutData,
          user_id: user?.id
        }, user?.id);
      } else {
        setToastMessage('Checkout failed: ' + response.error);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setToastMessage('Error processing checkout');
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Services</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Select Services</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonLabel>Loading services...</IonLabel>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {cards.map(card => (
                <IonCol size="12" sizeMd="6" sizeLg="3" key={card.id}>
                  <IonCard
                    className={`card-selectable ${card.isSelected ? 'selected' : ''}`}
                    style={{
                      border: card.isSelected ? '2px solid #3880ff' : '1px solid #ddd',
                      backgroundColor: card.isSelected ? '#f0f8ff' : 'White',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleSelection(card.id)}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      {card.isSelected && (
                        <IonIcon
                          icon="checkmark-circle"
                          color="success"
                          size="large"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'White',
                            borderRadius: '50%',
                            padding: '5px'
                          }}
                        />
                      )}
                    </div>

                    <IonCardHeader>
                      <IonCardTitle>{card.title}</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <p>{card.description}</p>

                      <div style={{ marginTop: '15px' }}>
                        {card.tokens > 0 ? (
                          <IonBadge color="primary">
                            {card.tokens} Tokens
                          </IonBadge>
                        ) : (
                          <IonBadge color="tertiary">
                            ${card.price.toFixed(2)}
                          </IonBadge>
                        )}

                        {card.price === 0 && card.tokens > 0 && (
                          <IonBadge color="success" style={{ marginLeft: '10px' }}>
                            Free
                          </IonBadge>
                        )}
                      </div>

                      <IonButton
                        expand="block"
                        fill={card.isSelected ? "solid" : "outline"}
                        style={{ marginTop: '15px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(card.id);
                        }}
                      >
                        {card.isSelected ? 'Selected' : 'Select'}
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>

      {/* Footer with cart summary */}
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow align-items-center>
              <IonCol size="8">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon="cart" style={{ fontSize: '24px', marginRight: '10px' }} />
                  <div>
                    <IonLabel>
                      <h3 style={{ margin: 0, fontWeight: 'bold' }}>
                        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        {totalTokens} tokens • ${totalPrice.toFixed(2)}
                      </p>
                    </IonLabel>
                  </div>
                </div>
              </IonCol>
              <IonCol size="4">
                <IonButton
                  expand="block"
                  disabled={selectedItems.length === 0 || isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

      {/* Toast notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
      />

      {/* Loading indicator */}
      <IonLoading
        isOpen={isProcessing}
        message={'Processing checkout...'}
      />
    </IonPage>
  );
};

export default SelectionPage;