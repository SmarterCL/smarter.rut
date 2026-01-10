import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/card-selection.css';
import './theme/smarteros-styles.css';

import { SupabaseProvider } from './services/supabase';
import { AuthProvider, useAuth } from './services/auth-provider';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import SelectionPage from './pages/SelectionPage';

const App: React.FC = () => {
  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>; // In a real app, you might want to show a spinner
    }

    return user ? <>{children}</> : <Redirect to="/login" />;
  };

  return (
    <SupabaseProvider>
      <AuthProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/dashboard">
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              </Route>
              <Route exact path="/selection">
                <ProtectedRoute>
                  <SelectionPage />
                </ProtectedRoute>
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </AuthProvider>
    </SupabaseProvider>
  );
};

export { App };