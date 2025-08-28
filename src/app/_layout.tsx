import '../../global.css';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1000);
    }, []);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="intro" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

