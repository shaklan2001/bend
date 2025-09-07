import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';
import { FontStyles } from '../lib/fonts';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getStreakScreenData, loadStreakData, saveStreakData } from '../lib/streakManager';

interface StreakScreenProps {
  exercisesCount: number;
  totalMinutes: number;
  routineName?: string;
  routineSlug?: string;
}

const StreakDay = memo(
  ({ day, isCompleted, isToday }: { day: string; isCompleted: boolean; isToday: boolean }) => {
    return (
      <View className='items-center' style={{ minWidth: 32 }}>
        <Text style={streakScreenStyles.dayLabel}>{day}</Text>
        <View
          style={[
            streakScreenStyles.dayCircle,
            { backgroundColor: isCompleted ? '#A69B8A' : '#E5E7EB' },
          ]}
        >
          {isCompleted && <Entypo name='check' size={16} color='#FFFFFF' />}
        </View>
      </View>
    );
  }
);

const StatRow = memo(({ label, value }: { label: string; value: number }) => {
  return (
    <View className='flex-row justify-between items-center py-2'>
      <Text style={streakScreenStyles.statLabel}>{label}</Text>
      <Text style={streakScreenStyles.statValue}>{value}</Text>
    </View>
  );
});

export default function StreakScreen() {
  const params = useLocalSearchParams();
  const exercisesCount = parseInt(params.exercisesCount as string) || 0;
  const totalMinutes = parseInt(params.totalMinutes as string) || 0;
  const routineName = (params.routineName as string) || 'Daily Routine';
  const routineSlug = (params.routineSlug as string) || '';

  const [currentStreak, setCurrentStreak] = useState(1);
  const [streakData, setStreakData] = useState<boolean[]>([]);
  const [canRestore, setCanRestore] = useState(false);
  const [streakRestoresAvailable, setStreakRestoresAvailable] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const days = ['To', 'Ye', 'Fr', 'Th', 'We', 'Tu', 'Mo'];

  useEffect(() => {
    loadStreakData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadStreakData = useCallback(async () => {
    try {
      const streakScreenData = await getStreakScreenData();
      setCurrentStreak(streakScreenData.currentStreak);
      setStreakData(streakScreenData.weeklyData);
      setCanRestore(streakScreenData.canRestore);
      setStreakRestoresAvailable(streakScreenData.streakRestoresAvailable);
    } catch (error) {
      console.error('Error loading streak data:', error);
      setCurrentStreak(1);
      setStreakData([true, false, false, false, false, false, false]);
      setCanRestore(false);
      setStreakRestoresAvailable(0);
    }
  }, []);

  const closeWithAnimation = useCallback(
    (callback: () => void) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(callback);
    },
    [fadeAnim]
  );

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const shareUrl = `https://bend.com/routines/${routineSlug}`;
      const message = `I just completed my ${routineName} routine! 🧘‍♀️ ${exercisesCount} exercises in ${totalMinutes} minutes. Join me on Bend: ${shareUrl}`;

      await Share.share({
        message,
        url: shareUrl,
        title: `${routineName} - Bend App`,
      });
    } catch (error) {
      console.error('Error sharing routine:', error);
    }
  }, [routineName, exercisesCount, totalMinutes, routineSlug]);

  const handleDone = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeWithAnimation(() => {
      setTimeout(() => {
        router.replace('/(tabs)/(home)');
      }, 100);
    });
  }, [closeWithAnimation]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeWithAnimation(() => {
      router.replace('/(tabs)/(home)');
    });
  }, [closeWithAnimation]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <Animated.View
        style={[{ opacity: fadeAnim }, { flex: 1, paddingHorizontal: 24, paddingTop: 20 }]}
      >
        <TouchableOpacity
          onPress={handleClose}
          className='absolute top-4 left-6 z-10 w-10 h-10 justify-center items-center'
          activeOpacity={0.7}
        >
          <Entypo name='cross' size={24} color='#374151' />
        </TouchableOpacity>

        <Text style={streakScreenStyles.congratsText}>Congrats!</Text>

        <Text style={streakScreenStyles.completionText}>You completed your daily routine.</Text>

        <View className='items-center my-8'>
          <Text style={streakScreenStyles.streakNumber}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </Text>
          <Text style={streakScreenStyles.streakLabel}>ACTIVE STREAK</Text>
        </View>

        <View className='flex-row justify-between items-center mb-6 px-2'>
          {days.map((day, index) => (
            <StreakDay
              key={day}
              day={day}
              isCompleted={streakData[index] || false}
              isToday={index === 0}
            />
          ))}
        </View>

        <View className='bg-gray-50 rounded-lg p-4 mb-6'>
          <Text style={streakScreenStyles.tipText}>
            <Text style={streakScreenStyles.tipLabel}>Tip: </Text>
            {streakRestoresAvailable > 0
              ? `You have ${streakRestoresAvailable} Streak Restore${streakRestoresAvailable > 1 ? 's' : ''} available.`
              : 'Unlock a Streak Restore by reaching a 2 day streak.'}
          </Text>
        </View>

        <View className='mb-8'>
          <Text style={streakScreenStyles.summaryTitle}>ROUTINE SUMMARY</Text>
          <View className='mt-3'>
            <StatRow label='Exercises' value={exercisesCount} />
            <StatRow label='Minutes' value={totalMinutes} />
          </View>
        </View>

        <View className='flex-row gap-4'>
          <TouchableOpacity
            style={streakScreenStyles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Entypo name='share' size={20} color='#6B7280' />
            <Text style={streakScreenStyles.shareText}>Share Routine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={streakScreenStyles.doneButton}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Text style={streakScreenStyles.doneText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const streakScreenStyles = StyleSheet.create({
  congratsText: {
    ...FontStyles.heading1,
    color: '#000000',
    fontWeight: '700',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40,
  },
  completionText: {
    ...FontStyles.bodyMedium,
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  streakNumber: {
    ...FontStyles.heading1,
    color: '#000000',
    fontWeight: '700',
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 56,
  },
  streakLabel: {
    ...FontStyles.bodyMedium,
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  dayLabel: {
    ...FontStyles.bodySmall,
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    ...FontStyles.bodySmall,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  tipLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  summaryTitle: {
    ...FontStyles.bodyMedium,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  statLabel: {
    ...FontStyles.bodyMedium,
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
  statValue: {
    ...FontStyles.heading3,
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    ...FontStyles.bodyMedium,
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    lineHeight: 24,
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#A69B8A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    ...FontStyles.button,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
});
