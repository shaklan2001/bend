import React, { memo, useCallback, useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FontStyles } from '../../lib/fonts';

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
}

interface ExerciseDurationCardProps {
  exercise: Exercise;
  duration: number;
  onDurationChange: (exerciseId: string, newDuration: number) => void;
  showDurationControls?: boolean;
  sequence?: number;
  showSequence?: boolean;
}

export const ExerciseDurationCard = memo(
  ({ exercise, duration, onDurationChange }: ExerciseDurationCardProps) => {
    const handleIncrease = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newDuration = Math.min(duration + 15, 600);
      onDurationChange(exercise.id, newDuration);
    }, [duration, exercise.id, onDurationChange]);

    const handleDecrease = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newDuration = Math.max(duration - 15, 15);
      onDurationChange(exercise.id, newDuration);
    }, [duration, exercise.id, onDurationChange]);

    const formatDuration = useCallback((seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    return (
      <View
        style={{
          borderRadius: 20,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            source={{ uri: exercise?.image_url }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
            resizeMode='cover'
          />
        </View>

        <View className='flex-1'>
          <Text
            style={[
              FontStyles.bodySmall,
              {
                color: '#000000',
                fontWeight: '700',
                marginBottom: 4,
                opacity: 0.8,
              },
            ]}
          >
            {exercise?.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleDecrease}
            style={{
              width: 25,
              height: 25,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: '#6B72808A',
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              -
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: '#111827',
              fontSize: 14,
              fontWeight: '600',
              minWidth: 40,
              textAlign: 'center',
              opacity: 0.6,
            }}
          >
            {formatDuration(duration)}
          </Text>

          <TouchableOpacity
            onPress={handleIncrease}
            style={{
              width: 25,
              height: 25,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: '#6B72808A',
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default ExerciseDurationCard;
