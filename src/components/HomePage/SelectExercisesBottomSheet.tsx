import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
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
import { GradientButton } from '../Button';

const { height: screenHeight } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
  duration_seconds?: number;
}

interface SelectExercisesBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onExercisesSelected?: (exercises: Exercise[]) => void;
}

const Header = memo(({ onClose }: { onClose: () => void }) => (
  <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-100'>
    <TouchableOpacity
      onPress={onClose}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      activeOpacity={0.7}
    >
      <Entypo name='cross' size={34} color='#D3D3D3' />
    </TouchableOpacity>

    <View className='flex-1 items-center'>
      <Text
        style={[
          FontStyles.heading2,
          {
            color: '#000000',
            fontWeight: '700',
            textAlign: 'center',
          },
        ]}
      >
        Select Stretches
      </Text>
    </View>

    <View className='w-10' />
  </View>
));

const SelectedExercises = memo(
  ({
    selectedExercises,
    onRemoveExercise,
  }: {
    selectedExercises: Exercise[];
    onRemoveExercise: (exerciseId: string) => void;
  }) => {
    if (selectedExercises.length === 0) {
      return (
        <View className='px-6 py-4'>
          <Text
            style={[
              FontStyles.heading3,
              {
                color: '#111827',
                fontWeight: '700',
                textAlign: 'center',
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
                fontWeight: '500',
                textAlign: 'center',
              },
            ]}
          >
            Tap an exercise to get started.
          </Text>
        </View>
      );
    }

    return (
      <View className='px-6 py-4'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {selectedExercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => onRemoveExercise(exercise.id)}
              style={{
                marginRight: 12,
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  position: 'relative',
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#A69B8A',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                  overflow: 'hidden',
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
                    top: -2,
                    right: -2,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#A69B8A',
                  }}
                >
                  <Text
                    style={{
                      color: '#A69B8A',
                      fontWeight: '700',
                      fontSize: 12,
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
            FontStyles.bodySmall,
            {
              color: '#6B7280',
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 8,
            },
          ]}
        >
          Tap to remove. Tap and hold to reorder.
        </Text>
      </View>
    );
  }
);

const ExerciseCard = memo(
  ({
    exercise,
    isSelected,
    onToggle,
  }: {
    exercise: Exercise;
    isSelected: boolean;
    onToggle: () => void;
  }) => {
    const handlePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle();
    }, [onToggle]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: '33.33%',
          alignItems: 'center',
          marginBottom: 20,
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isSelected ? '#A69B8A' : '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            overflow: 'hidden',
            borderWidth: isSelected ? 3 : 0,
            borderColor: '#A69B8A',
          }}
        >
          <Image
            source={{ uri: exercise.image_url }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
            }}
            resizeMode='cover'
          />
        </View>

        <Text
          style={[
            FontStyles.bodyMedium,
            {
              color: '#111827',
              fontWeight: '600',
              textAlign: 'center',
              fontSize: 14,
            },
          ]}
        >
          {exercise.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

const LoadingState = memo(() => (
  <View className='flex-1 justify-center items-center py-20'>
    <MaterialCommunityIcons name='yoga' size={64} color='#D1D5DB' />
    <Text
      style={[
        FontStyles.bodyMedium,
        {
          color: '#6B7280',
          marginTop: 16,
        },
      ]}
    >
      Loading exercises...
    </Text>
  </View>
));

const EmptyState = memo(() => (
  <View className='flex-1 justify-center items-center py-20'>
    <MaterialCommunityIcons name='yoga' size={64} color='#D1D5DB' />
    <Text
      style={[
        FontStyles.bodyMedium,
        {
          color: '#6B7280',
          marginTop: 16,
          textAlign: 'center',
        },
      ]}
    >
      No exercises available
    </Text>
  </View>
));

const SelectExercisesBottomSheet: React.FC<SelectExercisesBottomSheetProps> = memo(
  ({ visible, onClose, onExercisesSelected }) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchExercises = useCallback(async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('exercises')
          .select('id, name, description, image_url, video_url')
          .order('name');

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
          return [...prev, exercise];
        }
      });
    }, []);

    const removeExercise = useCallback((exerciseId: string) => {
      setSelectedExercises(prev => prev.filter(e => e.id !== exerciseId));
    }, []);

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
        setSelectedExercises([]);
        onClose();
      });
    }, [onClose, slideAnim, fadeAnim]);

    const handleNext = useCallback(() => {
      if (selectedExercises.length === 0) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (onExercisesSelected) {
        onExercisesSelected(selectedExercises);
      }
      handleClose();
    }, [selectedExercises, onExercisesSelected, handleClose]);

    useEffect(() => {
      if (visible && !isClosing) {
        fetchExercises();
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

    return (
      <Modal visible={visible} transparent={true} animationType='none' onRequestClose={handleClose}>
        <Animated.View className='flex-1 bg-black/50' style={{ opacity: fadeAnim }}>
          <Animated.View
            className='absolute bottom-0 left-0 right-0 bg-white'
            style={{
              height: screenHeight,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <SafeAreaView className='flex-1'>
              <Header onClose={handleClose} />

              <SelectedExercises
                selectedExercises={selectedExercises}
                onRemoveExercise={removeExercise}
              />

              <View className='flex-1'>
                {isLoading ? (
                  <LoadingState />
                ) : exercises.length > 0 ? (
                  <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <ExerciseCard
                        exercise={item}
                        isSelected={selectedExercises.some(e => e.id === item.id)}
                        onToggle={() => toggleExercise(item)}
                      />
                    )}
                    numColumns={3}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <EmptyState />
                )}
              </View>

              <View className='px-6 py-4 bg-white border-t border-gray-100'>
                <GradientButton
                  title='NEXT'
                  onPress={handleNext}
                  size='lg'
                  disabled={selectedExercises.length === 0}
                  style={{
                    opacity: selectedExercises.length === 0 ? 0.5 : 1,
                  }}
                />
              </View>
            </SafeAreaView>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);

export default SelectExercisesBottomSheet;
