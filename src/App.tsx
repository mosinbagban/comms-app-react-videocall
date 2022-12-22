import TranslationProvider from '@components/TranslationProvider';
import { ConferenceCreateProvider } from '@context/ConferenceCreateContext';
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';
import { Navigator } from '@src/routes/Navigator';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';

import './App.module.scss';
import axiosApiInstance from './utils/fetch';

const App = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);

  const urlToken = useMemo(() => {
    return encodeURIComponent(new URLSearchParams(window.location.search).get('token') || '');
  }, [location]);

  const YOUR_TOKEN = urlToken;

  useEffect(()=>{
    console.log('refresh-');
    refreshToken();
  },[]);

  const refreshToken = async()=>{
   const resp =  await axiosApiInstance.get(`${import.meta.env.VITE_API_URL}/api/token-generator`)
  //  console.log('Resp: ' + JSON.stringify(resp.data));
   setToken(resp?.data?.access_token);
   return resp?.data?.access_token
  }

  return (
    <TranslationProvider>
    {token &&
      <ConferenceCreateProvider>
     <CommsProvider token={token} refreshToken={refreshToken}
        packageUrlPrefix={`${import.meta.env.BASE_URL}assets/wasm`}
        >
          <ThemeProvider
            customThemes={{
              'My Theme': { colors: { white: 'yellow', primary: { 400: 'red' }, secondary: { 400: 'blue' } } },
            }}
          >
            <Navigator />
          </ThemeProvider>
        </CommsProvider>
      </ConferenceCreateProvider>
      }
    </TranslationProvider>
  );
};

const container = document.getElementById('root');
// no-non-null-assertion comes from official react docs
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
