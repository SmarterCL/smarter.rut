import React, { useState } from 'react';
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
  IonList
} from '@ionic/react';
import { placeholderImages } from '../utils/placeholders';

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
  // Sample card data - in a real app, this would come from an API
  const [cards, setCards] = useState<CardItem[]>([
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
  ]);

  const [selectedItems, setSelectedItems] = useState<CardItem[]>([]);

  const toggleSelection = (cardId: number) => {
    setCards(prevCards => 
      prevCards.map(card => {
        if (card.id === cardId) {
          const newSelectedState = !card.isSelected;
          
          // Update selected items list
          if (newSelectedState) {
            const selectedItem = { ...card, isSelected: true };
            setSelectedItems(prev => [...prev, selectedItem]);
          } else {
            setSelectedItems(prev => prev.filter(item => item.id !== cardId));
          }
          
          return { ...card, isSelected: newSelectedState };
        }
        return card;
      })
    );
  };

  const totalTokens = selectedItems.reduce((sum, item) => sum + item.tokens, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

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

        <IonGrid>
          <IonRow>
            {cards.map(card => (
              <IonCol size="12" sizeMd="6" sizeLg="3" key={card.id}>
                <IonCard 
                  className={`card-selectable ${card.isSelected ? 'selected' : ''}`}
                  style={{ 
                    border: card.isSelected ? '2px solid #3880ff' : '1px solid #ddd',
                    backgroundColor: card.isSelected ? '#f0f8ff' : 'white',
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
                          backgroundColor: 'white',
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
                  disabled={selectedItems.length === 0}
                  onClick={() => {
                    // Handle checkout/cart submission
                    alert(`Selected items: ${selectedItems.map(item => item.title).join(', ')}`);
                  }}
                >
                  Checkout
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SelectionPage;