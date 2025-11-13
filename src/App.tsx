import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';

import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { Authenticator, Button, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import type { UserAttributeKey } from 'aws-amplify/auth';
Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

const theme = createTheme({
  name: 'custom-theme'
});

function App() {
  const [userAttributes, setUserAttributes] = useState<Partial<Record<UserAttributeKey, string>> | null>(null);

  const getUserAttributes = async () => {
    try {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <div className="header">
              <img src="/logo.jpg" alt="Logo" style={{ height: '40px', marginRight: '1rem' }} />
              <h1>{`Hello ${user?.signInDetails?.loginId || user?.username}`}</h1>
              <Button onClick={signOut}>Sign out</Button>
            </div>
            <div style={{ padding: '2rem' }}>
              <h1>My Document Storage</h1>
              <p>Managing files in your secure storage buckets</p>
              <StorageBrowser />
            </div>
          </>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
