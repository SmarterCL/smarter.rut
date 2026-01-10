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
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../services/auth-provider';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPassword, signUp, signInWithOAuth, loading } = useAuth();
  const history = useHistory();
  const [presentToast] = useIonToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithPassword(email, password);
      presentToast({
        message: 'Inicio de sesión exitoso',
        duration: 3000,
        color: 'success'
      });
      history.push('/dashboard');
    } catch (error: any) {
      presentToast({
        message: error.message || 'Error al iniciar sesión',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      await signUp(email, password);
      presentToast({
        message: 'Cuenta creada exitosamente. Por favor revisa tu email.',
        duration: 5000,
        color: 'success'
      });
    } catch (error: any) {
      presentToast({
        message: error.message || 'Error al crear cuenta',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'facebook' | 'apple') => {
    try {
      await signInWithOAuth(provider);
      // Note: OAuth redirects happen automatically
    } catch (error: any) {
      presentToast({
        message: error.message || `Error al iniciar sesión con ${provider}`,
        duration: 3000,
        color: 'danger'
      });
    }
  };

  if (loading || isLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
          <p>Cargando...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" offsetMd="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Iniciar Sesión</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleLogin}>
                    <IonItem>
                      <IonLabel position="stacked">Email</IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        placeholder="tu@email.com"
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput
                        type="password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        placeholder="••••••••"
                        required
                      />
                    </IonItem>

                    <IonButton
                      expand="block"
                      type="submit"
                      className="ion-margin-top"
                      disabled={isLoading}
                    >
                      {isLoading ? <IonSpinner /> : 'Iniciar Sesión'}
                    </IonButton>
                  </form>

                  <IonButton
                    expand="block"
                    fill="outline"
                    className="ion-margin-top"
                    onClick={handleSignUp}
                    disabled={isLoading}
                  >
                    Crear Cuenta
                  </IonButton>

                  <IonText color="medium" className="ion-text-center ion-padding-top">
                    <p>O inicia sesión con:</p>
                  </IonText>

                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonButton
                          expand="block"
                          fill="outline"
                          color="secondary"
                          onClick={() => handleOAuthLogin('google')}
                        >
                          Google
                        </IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton
                          expand="block"
                          fill="outline"
                          color="dark"
                          onClick={() => handleOAuthLogin('github')}
                        >
                          GitHub
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;