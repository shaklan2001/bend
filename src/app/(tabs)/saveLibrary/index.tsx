import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontStyles } from '../../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { getSavedRoutines, SavedRoutine } from '../../../lib/saveRoutine';
import { RoutineCard } from '../../../components/HomePage/RoutineBottomSheet';

// Memoized Saved Routine Card Component (without delete button)
const SavedRoutineCard = memo(({ routine, onPress }: {
  routine: SavedRoutine,
  onPress: (routine: SavedRoutine) => void,
}) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(routine);
  }, [routine, onPress]);

  return (
    <RoutineCard routine={routine} onPress={handlePress} />
  );
});

// Memoized Empty State Component matching the image
const EmptyState = memo(() => (
  <View className="flex-1 justify-center items-center px-6">
    <MaterialCommunityIcons
      name="bookmark-outline"
      size={80}
      color="#D1D5DB"
    />
    <Text style={[FontStyles.heading2, {
      color: '#000000',
      textAlign: 'center',
      marginTop: 24,
      fontWeight: '700',
    }]}>
      Your library is empty
    </Text>
    <Text style={[FontStyles.bodyMedium, {
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 20,
      maxWidth: 280,
    }]}>
      View your active series, favorite routines, and recent routines here.
    </Text>
  </View>
));

// Memoized Header Component
const Header = memo(() => (
  <View className="flex-row items-center justify-center px-6 py-4 border-b border-gray-100">
    <Text style={[FontStyles.heading1, {
      color: '#000000',
      fontWeight: '700',
    }]}>
      My Library
    </Text>
  </View>
));

const SaveLibrary = () => {
  const router = useRouter();
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedRoutines = useCallback(async () => {
    try {
      setIsLoading(true);
      const routines = await getSavedRoutines();
      setSavedRoutines(routines);
    } catch (error) {
      console.error('Error loading saved routines:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedRoutines();
  }, [loadSavedRoutines]);

  // Refresh saved routines when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedRoutines();
    }, [loadSavedRoutines])
  );

  const handleRoutinePress = useCallback((routine: SavedRoutine) => {
    router.push(`/routine/${routine.slug}`);
  }, [router]);

  const sortedRoutines = useMemo(() => {
    return [...savedRoutines].sort((a, b) => b.savedAt - a.savedAt);
  }, [savedRoutines]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center">
          <Text style={[FontStyles.bodyLarge, { color: '#9CA3AF' }]}>
            Loading saved routines...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <Header />

      {savedRoutines.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          {sortedRoutines.map((routine) => (
            <SavedRoutineCard
              key={routine.id}
              routine={routine}
              onPress={handleRoutinePress}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SaveLibrary;