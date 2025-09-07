import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isNavigating) {
        setIsNavigating(true);
        router.replace('/intro');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router, isNavigating]);

  return <View style={{ flex: 1, backgroundColor: 'white' }} />;
}
