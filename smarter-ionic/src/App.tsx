import React from 'react';
import { IonApp, setupConfig } from '@ionic/react';

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

import { SupabaseProvider } from './services/supabase';

const App: React.FC = () => {
  setupConfig({
    mode: 'ios' // or 'md' for Material Design
  });

  return (
    <SupabaseProvider>
      <IonApp>
        <div className="ion-page">
          <h1>Smarter Ionic App</h1>
          <p>Ready for Supabase integration</p>
        </div>
      </IonApp>
    </SupabaseProvider>
  );
};

export { App };