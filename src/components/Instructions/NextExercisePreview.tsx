import React, { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { FontStyles } from '../../lib/fonts';
const { width: screenWidth } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
}

interface NextExercisePreviewProps {
  exercise: Exercise;
}

export const NextExercisePreview = memo(({ exercise }: NextExercisePreviewProps) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  return (
    <Animated.View
      className='absolute top-5 right-5 bg-white rounded-2xl p-3 max-w-[30%]'
      style={[
        nextExercisePreviewStyles.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text className='text-center mb-2' style={nextExercisePreviewStyles.label}>
        Up Next
      </Text>
      <View className='w-15 h-15 rounded-full bg-gray-100 justify-center items-center mb-2 overflow-hidden'>
        <Image
          source={{ uri: exercise.image_url }}
          className='w-15 h-15 rounded-full'
          resizeMode='cover'
        />
      </View>
      <Text
        className='text-center'
        style={nextExercisePreviewStyles.exerciseName}
        numberOfLines={2}
      >
        {exercise.name}
      </Text>
    </Animated.View>
  );
});

const nextExercisePreviewStyles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: screenWidth * 0.3,
  },
  label: {
    ...FontStyles.bodySmall,
    color: '#6B7280',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  exerciseName: {
    ...FontStyles.bodySmall,
    color: '#000000',
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    fontSize: 12,
  },
});
