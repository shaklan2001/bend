import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontStyles } from '../../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { getSavedRoutines, SavedRoutine } from '../../../lib/saveRoutine';
import { HistoryList } from '../../../components/Shared/HistoryList';
import { loadHistory, HistoryItem } from '../../../lib/historyManager';
import { BaseRecommendedCard } from '../../../components/HomePage/RecommendedRoutines';


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
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedRoutines = useCallback(async () => {
    try {
      setIsLoading(true);
      const [routines, history] = await Promise.all([
        getSavedRoutines(),
        loadHistory()
      ]);
      setSavedRoutines(routines);
      setHistoryItems(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedRoutines();
  }, [loadSavedRoutines]);

  useFocusEffect(
    useCallback(() => {
      loadSavedRoutines();
    }, [loadSavedRoutines])
  );

  const handleRoutinePress = useCallback((routine: SavedRoutine | any) => {
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
      {savedRoutines.length === 0 && historyItems.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
          {savedRoutines.length > 0 && (
            <View className="px-6 mb-6">
              <Text style={[FontStyles.bodyMedium, {
                color: '#9CA3AF',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: 4,
                fontSize: 14,
                letterSpacing: 1,
                opacity: 0.6,
              }]}>
                MY FAVORITES
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 6 }}
              >
                {sortedRoutines.map((routine) => (
                  <BaseRecommendedCard
                    key={routine.id}
                    data={routine}
                    onPress={handleRoutinePress}
                    showAnimation={false}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          <HistoryList items={historyItems} maxItems={20} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SaveLibrary;