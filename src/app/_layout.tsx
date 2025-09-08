import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import '../../global.css';
import { authService } from '../lib/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Initialize auth service
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    // Cleanup on unmount
    return () => {
      authService.cleanup();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='intro' />
      <Stack.Screen name='(onboarding)' />
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='routine' />
      <Stack.Screen name='streak' />
    </Stack>
  );
}
