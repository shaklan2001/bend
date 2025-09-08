import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontStyles } from '../../lib/fonts';
import { completeToday } from '../../lib/streakManager';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToStreak: () => void;
  exercisesCount: number;
  totalMinutes: number;
  daysCompleted: number;
  routineName?: string;
  routineSlug?: string;
}

const StatCard = memo(({ label, value }: { label: string; value: number }) => {
  return (
    <View className='flex-row justify-between items-center bg-gray-100 rounded-lg p-4 mb-3'>
      <Text style={successModalStyles.statLabel}>{label}</Text>
      <Text style={successModalStyles.statValue}>{value}</Text>
    </View>
  );
});

export const SuccessModal = memo(
  ({
    visible,
    onClose,
    onAddToStreak: _onAddToStreak,
    exercisesCount,
    totalMinutes,
    daysCompleted,
    routineName = 'Daily Routine',
    routineSlug = '',
  }: SuccessModalProps) => {
    const congratsAnim = useState(new Animated.Value(0))[0];
    const descriptionAnim = useState(new Animated.Value(0))[0];
    const statsAnim = useState(new Animated.Value(0))[0];
    const buttonAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if (visible) {
        congratsAnim.setValue(0);
        descriptionAnim.setValue(0);
        statsAnim.setValue(0);
        buttonAnim.setValue(0);

        const timer1 = setTimeout(() => {
          Animated.timing(congratsAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }, 2500);

        const timer2 = setTimeout(() => {
          Animated.timing(descriptionAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }, 3200);

        const timer3 = setTimeout(() => {
          Animated.timing(statsAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }, 3900);

        const timer4 = setTimeout(() => {
          Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }, 4600);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
        };
      }
    }, [visible, congratsAnim, descriptionAnim, statsAnim, buttonAnim]);

    const handleAddToStreak = useCallback(async () => {
      try {
        await completeToday({
          id: routineSlug || 'unknown',
          name: routineName || 'Daily Routine',
          duration: totalMinutes,
          slug: routineSlug || '',
          exercisesCount,
          totalMinutes,
        });

        router.replace({
          pathname: '/streak',
          params: {
            exercisesCount: exercisesCount.toString(),
            totalMinutes: totalMinutes.toString(),
            routineName,
            routineSlug,
          },
        });

        setTimeout(() => {
          onClose();
        }, 100);
      } catch (error) {
        console.error('Error completing routine:', error);
        router.replace({
          pathname: '/streak',
          params: {
            exercisesCount: exercisesCount.toString(),
            totalMinutes: totalMinutes.toString(),
            routineName,
            routineSlug,
          },
        });
        setTimeout(() => {
          onClose();
        }, 100);
      }
    }, [onClose, exercisesCount, totalMinutes, routineName, routineSlug]);

    return (
      <Modal visible={visible} animationType='slide' presentationStyle='fullScreen'>
        <StatusBar style='dark' />
        <SafeAreaView className='flex-1 bg-white'>
          <View className='flex-1 justify-center items-center px-6'>
            <View className='w-48 h-48 mb-8'>
              <LottieView
                source={require('../../../assets/lottie/success.json')}
                autoPlay
                loop={false}
                speed={0.6}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <Animated.View
              style={[
                {
                  opacity: congratsAnim,
                },
              ]}
            >
              <Text style={successModalStyles.congratsText}>Congrats!</Text>
            </Animated.View>

            <Animated.View
              style={[
                {
                  opacity: descriptionAnim,
                },
              ]}
            >
              <Text style={successModalStyles.completionText}>
                You completed your daily routine.
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                {
                  opacity: statsAnim,
                },
              ]}
              className='w-full mt-6'
            >
              <StatCard label='Exercises' value={exercisesCount} />
              <StatCard label='Minutes' value={totalMinutes} />
              <StatCard label='Days Completed' value={daysCompleted} />
            </Animated.View>

            <Animated.View
              style={[
                {
                  opacity: buttonAnim,
                },
              ]}
              className='absolute bottom-4 w-full px-6'
            >
              <TouchableOpacity
                className='bg-[#A69B8A] rounded-full py-4 px-10 w-full items-center'
                onPress={handleAddToStreak}
                activeOpacity={0.8}
              >
                <Text style={successModalStyles.addToStreakText}>ADD TO STREAK</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
);

const successModalStyles = StyleSheet.create({
  congratsText: {
    ...FontStyles.heading1,
    color: '#000000',
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  completionText: {
    ...FontStyles.bodyMedium,
    color: '#6B7280',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  statLabel: {
    ...FontStyles.bodyMedium,
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    ...FontStyles.heading3,
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  addToStreakText: {
    ...FontStyles.button,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
