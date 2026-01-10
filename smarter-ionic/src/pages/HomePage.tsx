import React from 'react';
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
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import HeaderImageHolder from '../components/HeaderImageHolder';

const HomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SmarterBOT Mobile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <HeaderImageHolder
          title="SmarterOS"
          subtitle="Tu plataforma de automatización y tecnología integral"
          imageUrl="/assets/images/header-image.jpg" // Esta imagen no existe, mostrará el holder
          showPlaceholder={true}
          aspectRatio="16/9"
        />

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>SmarterBOT Mobile App</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Your gateway to the SmarterBOT ecosystem on mobile devices.</p>

            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonButton
                    expand="block"
                    onClick={() => history.push('/login')}
                  >
                    Login
                  </IonButton>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => history.push('/dashboard')}
                  >
                    Dashboard
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;