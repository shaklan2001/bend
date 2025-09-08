import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NextButton } from '@src/components/Shared/NextButton';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontStyles } from '../../lib/fonts';
import { supabase } from '../../lib/supabase';
import Gravity from '../UI/Gravity';
import Header from '../UI/Header';
import DurationModal from './DurationModal';
const { height: screenHeight } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
}

interface SelectedExercise extends Exercise {
  duration_seconds: number;
  sequence: number;
}

interface RoutineBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ExerciseCard = memo(
  ({
    exercise,
    onToggle,
  }: {
    exercise: Exercise;
    isSelected: boolean;
    onToggle: (exercise: Exercise) => void;
    sequence?: number;
  }) => {
    const handlePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle(exercise);
    }, [exercise, onToggle]);

    return (
      <TouchableOpacity onPress={handlePress} className='items-center mb-6' activeOpacity={0.8}>
        <View className='relative'>
          <View
            style={{
              width: 105,
              height: 105,
              borderRadius: 50,
              backgroundColor: '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#E5E7EB',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: exercise.image_url }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 50,
              }}
            />
          </View>
        </View>
        <Text
          style={[
            FontStyles.bodySmall,
            {
              color: '#374151',
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 8,
              maxWidth: 80,
            },
          ]}
        >
          {exercise.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

const SelectedExercises = memo(
  ({
    selectedExercises,
    onRemove,
  }: {
    selectedExercises: SelectedExercise[];
    onRemove: (exerciseId: string) => void;
  }) => {
    if (selectedExercises.length === 0) return null;

    return (
      <View className='mb-6 h-[150px]'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {selectedExercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => onRemove(exercise.id)}
              className='mr-4 mt-2'
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  backgroundColor: '#3B82F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Image
                  source={{ uri: exercise.image_url }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                  }}
                  resizeMode='cover'
                />

                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <Text
                    style={{
                      color: '#000000',
                      fontWeight: '800',
                      fontSize: 10,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text
          style={[
            FontStyles.bodyMedium,
            {
              color: '#6B7280',
              fontWeight: '600',
              marginBottom: 12,
              textAlign: 'center',
              opacity: 0.6,
            },
          ]}
        >
          Tap to remove. Tap and hold to reorder.
        </Text>
      </View>
    );
  }
);

const LoadingState = memo(() => (
  <View className='py-20 items-center'>
    <MaterialCommunityIcons name='yoga' size={64} color='#D1D5DB' />
    <Text
      style={[
        FontStyles.bodyMedium,
        {
          color: '#9CA3AF',
          marginTop: 16,
        },
      ]}
    >
      Loading exercises...
    </Text>
  </View>
));

const EmptyState = memo(() => (
  <View className='py-20 items-center'>
    <MaterialCommunityIcons name='yoga' size={64} color='#D1D5DB' />
    <Text
      style={[
        FontStyles.bodyMedium,
        {
          color: '#9CA3AF',
          marginTop: 16,
          textAlign: 'center',
        },
      ]}
    >
      No exercises available
    </Text>
  </View>
));

const CustomModal = memo(({ visible, onClose }: RoutineBottomSheetProps) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isClosing, setIsClosing] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDurationModalVisible, setIsDurationModalVisible] = useState(false);

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('exercises').select('*').order('name');

      if (error) {
        console.error('Error fetching exercises:', error);
        return;
      }

      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e.id === exercise.id);

      if (isSelected) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        const newExercise: SelectedExercise = {
          ...exercise,
          duration_seconds: 30,
          sequence: prev.length + 1,
        };
        return [...prev, newExercise];
      }
    });
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercises(prev => {
      const filtered = prev.filter(e => e.id !== exerciseId);
      return filtered.map((exercise, index) => ({
        ...exercise,
        sequence: index + 1,
      }));
    });
  }, []);

  const handleNext = useCallback(() => {
    if (selectedExercises.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDurationModalVisible(true);
  }, [selectedExercises]);

  const handleDurationSave = useCallback(
    (exercisesWithDuration: any[]) => {
      console.log('Exercises with custom durations:', exercisesWithDuration);
      onClose();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsClosing(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsClosing(false);
      onClose();
    });
  }, [onClose, slideAnim, fadeAnim]);

  useEffect(() => {
    if (visible && !isClosing) {
      fetchExercises();
      setSelectedExercises([]);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, isClosing, slideAnim, fadeAnim, fetchExercises]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType='none' onRequestClose={handleClose}>
      <StatusBar style='dark' />
      <Animated.View className='flex-1 bg-black/50' style={{ opacity: fadeAnim }}>
        <Animated.View
          className='absolute bottom-0 left-0 right-0 bg-white'
          style={{
            height: screenHeight,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <SafeAreaView className='flex-1'>
            <Header title='Select Stretches' onClose={handleClose} />

            <ScrollView
              className='flex-1'
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 120,
              }}
              showsVerticalScrollIndicator={false}
            >
              <SelectedExercises selectedExercises={selectedExercises} onRemove={removeExercise} />

              {selectedExercises.length === 0 ? (
                <View className='items-center h-[150px]'>
                  <Text
                    style={[
                      FontStyles.heading3,
                      {
                        color: '#111827',
                        fontWeight: '700',
                        textAlign: 'center',
                        paddingTop: 30,
                        marginBottom: 8,
                      },
                    ]}
                  >
                    Create Your Own Routine
                  </Text>
                  <Text
                    style={[
                      FontStyles.bodyMedium,
                      {
                        color: '#6B7280',
                        textAlign: 'center',
                      },
                    ]}
                  >
                    Tap an exercise to get started.
                  </Text>
                </View>
              ) : null}

              {isLoading ? (
                <LoadingState />
              ) : exercises.length > 0 ? (
                <View>
                  <View className='flex-row flex-wrap justify-between border-t border-gray-100 pt-4 gap-1'>
                    {exercises.map(exercise => {
                      const isSelected = selectedExercises.some(e => e.id === exercise.id);
                      const selectedExercise = selectedExercises.find(e => e.id === exercise.id);

                      return (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          isSelected={isSelected}
                          onToggle={toggleExercise}
                          sequence={selectedExercise?.sequence}
                        />
                      );
                    })}
                  </View>
                </View>
              ) : (
                <EmptyState />
              )}
            </ScrollView>
            <Gravity>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 24,
                  paddingVertical: 20,
                }}
              >
                <NextButton onPress={handleNext} />
              </View>
            </Gravity>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>

      {isDurationModalVisible && (
        <DurationModal
          visible={isDurationModalVisible}
          onClose={() => setIsDurationModalVisible(false)}
          exercises={selectedExercises}
          onSave={handleDurationSave}
        />
      )}
    </Modal>
  );
});

export default CustomModal;
