import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AudioPlayerProvider from './contexts/AudioContext';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import createRouter from './routes';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const router = createRouter();

  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <RouterProvider router={router} />
        <GlobalAudioPlayer />
        <Toaster position="top-right" />
      </AudioPlayerProvider>
    </AuthProvider>
  );
}

export default App;
