import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import AppNavigation from './src/navigation';
import { apiCall } from './src/api/openAI';
import { ThemeProvider } from './src/themes/ThemeContext';

export default function App() {
  useEffect(() => {
    // apiCall('create an image of a cat');
  }, [])

  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
    
  );
}