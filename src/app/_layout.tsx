import '../../global.css';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import { authManager } from '../store/managers/authManager';
import { Text, View } from 'react-native';
SplashScreen.preventAutoHideAsync();

// Loading component for Redux persist
const LoadingComponent = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    }}
  >
    <Text style={{ fontSize: 18, color: '#6B7280' }}>Loading...</Text>
  </View>
);

export default function RootLayout() {
  useEffect(() => {
    // Initialize auth manager
    authManager.init(store.dispatch);

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    // Cleanup on unmount
    return () => {
      authManager.cleanup();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
}
