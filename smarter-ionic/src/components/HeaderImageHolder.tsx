// src/components/HeaderImageHolder.tsx
// Componente de header con holder de imagen para SmarterOS

import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import ImageHolder from './ImageHolder';

interface HeaderImageHolderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  showPlaceholder?: boolean;
  skeleton?: boolean;
  aspectRatio?: string;
}

const HeaderImageHolder: React.FC<HeaderImageHolderProps> = ({
  title = "SmarterOS",
  subtitle = "Tu plataforma de automatización",
  imageUrl,
  showPlaceholder = true,
  skeleton = false,
  aspectRatio = "16/9"
}) => {
  return (
    <>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <div className="ion-padding">
        <IonCard>
          <ImageHolder 
            src={imageUrl} 
            alt={`${title} header`}
            showPlaceholder={showPlaceholder}
            skeleton={skeleton}
            aspectRatio={aspectRatio}
            className="w-full"
          />
          <IonCardContent>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </IonCardContent>
        </IonCard>
      </div>
    </>
  );
};

export default HeaderImageHolder;