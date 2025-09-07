import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const checkOnboardingStatus = async () => {
  try {
    const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
    const onboardingData = await AsyncStorage.getItem('onboardingData');

    if (hasCompletedOnboarding === 'true' && onboardingData) {
      const parsedData = JSON.parse(onboardingData);
      return {
        completed: parsedData.onboarding_completed || false,
        data: parsedData,
      };
    }
    return { completed: false, data: null };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { completed: false, data: null };
  }
};

export const getOnboardingData = async () => {
  try {
    const onboardingData = await AsyncStorage.getItem('onboardingData');
    if (onboardingData) {
      return JSON.parse(onboardingData);
    }
    return null;
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    return null;
  }
};

export const clearOnboardingData = async () => {
  try {
    await AsyncStorage.removeItem('onboardingData');
    await AsyncStorage.removeItem('hasCompletedOnboarding');
    console.log('Onboarding data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
    return false;
  }
};
