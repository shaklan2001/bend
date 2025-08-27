import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to intro screen on app launch
        router.replace('/intro');
    }, []);

    return null; // This component won't be visible as it redirects immediately
}
