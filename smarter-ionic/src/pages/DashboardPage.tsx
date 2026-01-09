import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { useAuth } from '../services/auth-provider';
import { validateRut, formatRut, cleanRut } from '../../../shared/services/utils';
import { useHistory } from 'react-router-dom';
import { User } from '../../../shared/types';

const DashboardPage: React.FC = () => {
  const { user, authService, signOut } = useAuth();
  const history = useHistory();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (authService && user) {
        try {
          // Fetch user data from accounts table
          const { data, error } = await authService.supabase
            .from('accounts')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error in fetchUserData:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [authService, user]);

  const handleSignOut = async () => {
    await signOut();
    history.push('/login');
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <p>Loading dashboard...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSignOut}>
              <IonIcon icon="logOutOutline" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>User Information</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        <h2>Email</h2>
                        <p>{user?.email}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Name</h2>
                        <p>{userData?.firstName} {userData?.lastName1}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Account Type</h2>
                        <p>{userData?.type}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <h2>Payment Status</h2>
                        <p>
                          <IonBadge
                            color={userData?.paymentStatus === 'DONE' ? 'success' : 'warning'}
                          >
                            {userData?.paymentStatus}
                          </IonBadge>
                        </p>
                      </IonLabel>
                    </IonItem>
                    {userData?.expirationDate && (
                      <IonItem>
                        <IonLabel>
                          <h2>Subscription Expiry</h2>
                          <p>{new Date(userData.expirationDate).toLocaleDateString()}</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonList>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>RUT Information</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        <h2>RUT Validation</h2>
                        <p>
                          {userData?.rut
                            ? validateRut(userData.rut)
                              ? 'Valid RUT'
                              : 'Invalid RUT'
                            : 'No RUT provided'}
                        </p>
                      </IonLabel>
                    </IonItem>
                    {userData?.rut && (
                      <IonItem>
                        <IonLabel>
                          <h2>Formatted RUT</h2>
                          <p>{formatRut(userData.rut)}</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Quick Actions</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" className="ion-margin-bottom" onClick={() => history.push('/selection')}>
                    Select Services
                  </IonButton>
                  <IonButton expand="block" fill="outline" className="ion-margin-bottom">
                    Manage Subscription
                  </IonButton>
                  <IonButton expand="block" fill="clear" color="danger" onClick={handleSignOut}>
                    Sign Out
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;