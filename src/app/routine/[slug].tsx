import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { ExerciseModal } from '@src/components/Instructions/ExerciseModal';
import { ExerciseDurationCard } from '@src/components/Shared/ExerciseDurationCard';
import Gravity from '@src/components/UI/Gravity';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GradientButton, ShareButton } from '../../components/Button';
import { getCustomRoutineBySlug } from '../../lib/customRoutines';
import { FontStyles } from '../../lib/fonts';
import { isRoutineSaved, removeRoutine, SavedRoutine, saveRoutine } from '../../lib/saveRoutine';
import { supabase } from '../../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  total_duration_minutes: number;
  body_part_id: string;
  slug: string;
  image_url?: string;
  isCustom?: boolean;
}

interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  sequence: number;
  duration_seconds: number;
  exercise: Exercise;
}

const Header = memo(({ handleBack, routine }: { handleBack: () => void; routine: Routine }) => {
  return (
    <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-100'>
      <TouchableOpacity
        onPress={handleBack}
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
              opacity: 0.8,
            },
          ]}
        >
          {routine.name}
        </Text>
      </View>
      <View className='w-10' />
    </View>
  );
});

const ExerciseCard = memo(
  ({
    exercise,
    duration,
    sequence,
    onDurationChange,
  }: {
    exercise: Exercise;
    duration: number;
    sequence: number;
    onDurationChange: (exerciseId: string, newDuration: number) => void;
  }) => {
    const handleDurationChange = useCallback(
      (exerciseId: string, newDuration: number) => {
        onDurationChange(exerciseId, newDuration);
      },
      [onDurationChange]
    );

    return (
      <ExerciseDurationCard
        exercise={exercise}
        duration={duration}
        onDurationChange={handleDurationChange}
        showDurationControls={true}
        sequence={sequence}
        showSequence={true}
      />
    );
  }
);

const RoutineInfo = memo(
  ({
    isFavorite,
    routine,
    totalMinutes,
    onPressFavorite,
  }: {
    isFavorite: boolean;
    routine: Routine;
    totalMinutes: number;
    onPressFavorite: () => void;
  }) => (
    <View className='items-center'>
      <View className='flex-row items-center justify-between w-full'>
        <View className='w-10' />
        <Text
          style={[
            FontStyles.heading3,
            {
              color: '#6B7280',
              fontWeight: '600',
            },
          ]}
        >
          {totalMinutes} minutes
        </Text>
        {!routine.isCustom && (
          <Pressable onPress={onPressFavorite}>
            <Feather
              name='heart'
              size={20}
              color={isFavorite ? '#EF4444' : '#6B7280'}
              fill={isFavorite ? '#EF4444' : 'none'}
            />
          </Pressable>
        )}
        {routine.isCustom && <View className='w-10' />}
      </View>
      {routine.description && (
        <Text
          style={[
            FontStyles.bodyMedium,
            {
              color: '#6B7280',
              marginBottom: 24,
              lineHeight: 24,
              marginTop: 8,
            },
          ]}
        >
          {routine.description}
        </Text>
      )}
    </View>
  )
);

const SectionTitle = memo(() => (
  <Text
    style={[
      FontStyles.bodyMedium,
      {
        color: '#A69B8A',
        fontWeight: '700',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 16,
      },
    ]}
  >
    EXERCISES
  </Text>
));

const LoadingState = memo(() => (
  <SafeAreaView className='flex-1 bg-white'>
    <StatusBar style='dark' />
    <View className='flex-1 justify-center items-center'>
      <Text style={[FontStyles.bodyLarge, { color: '#9CA3AF' }]}>Loading routine...</Text>
    </View>
  </SafeAreaView>
));

const ErrorState = memo(({ error, onBack }: { error: string; onBack: () => void }) => (
  <SafeAreaView className='flex-1 bg-white'>
    <StatusBar style='dark' />
    <View className='flex-1 justify-center items-center px-6'>
      <MaterialCommunityIcons name='alert-circle' size={64} color='#EF4444' />
      <Text
        style={[
          FontStyles.heading2,
          {
            color: '#EF4444',
            textAlign: 'center',
            marginTop: 16,
          },
        ]}
      >
        {error || 'Routine not found'}
      </Text>
      <TouchableOpacity
        onPress={onBack}
        style={{
          marginTop: 24,
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: '#EF4444',
          borderRadius: 8,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
));

const ActionButtons = memo(({ onShare, onStart }: { onShare: () => void; onStart: () => void }) => (
  <Gravity>
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 10,
      }}
    >
      <ShareButton title='Share Routine' onPress={onShare} size='lg' />
      <GradientButton title='START' onPress={onStart} size='lg' />
    </View>
  </Gravity>
));

const RoutineDetail = () => {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const fetchRoutineData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const routineSlug = slug as string;
      const customRoutine = await getCustomRoutineBySlug(routineSlug);

      if (customRoutine) {
        const routineData: Routine = {
          id: customRoutine.id,
          name: customRoutine.name,
          description: '',
          total_duration_minutes: Math.floor(customRoutine.totalDuration / 60),
          body_part_id: 'custom',
          slug: customRoutine.slug,
          image_url: customRoutine.coverImage,
          isCustom: true,
        };

        setRoutine(routineData);
        setIsFavorite(false);

        const transformedExercises = customRoutine.exercises.map(exercise => ({
          id: `${customRoutine.id}_${exercise.id}`,
          routine_id: customRoutine.id,
          exercise_id: exercise.id,
          sequence: exercise.sequence,
          duration_seconds: exercise.duration_seconds,
          exercise: {
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            image_url: exercise.image_url,
            video_url: exercise.video_url,
          },
        }));

        setExercises(transformedExercises);
        return;
      }

      const { data: routineData, error: routineError } = await supabase
        .from('routines')
        .select('*')
        .eq('slug', routineSlug)
        .single();

      if (routineError) {
        throw new Error('Routine not found');
      }

      setRoutine(routineData);

      if (routineData) {
        const saved = await isRoutineSaved(routineData.id);
        setIsFavorite(saved);
      }

      const { data: exerciseData, error: exerciseError } = await supabase
        .from('routine_exercises')
        .select('*')
        .eq('routine_id', routineData.id)
        .order('sequence', { ascending: true });

      if (exerciseError) {
        throw new Error('Failed to load exercises');
      }

      const exerciseIds = exerciseData?.map(item => item.exercise_id) || [];

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('id, name, description, image_url, video_url')
        .in('id', exerciseIds);

      if (exercisesError) {
        throw new Error('Failed to load exercise details');
      }
      const exercisesMap = new Map();
      exercisesData?.forEach(exercise => {
        exercisesMap.set(exercise.id, exercise);
      });

      const transformedExercises = (exerciseData || []).map(item => ({
        id: item.id,
        routine_id: item.routine_id,
        exercise_id: item.exercise_id,
        sequence: item.sequence,
        duration_seconds: item.duration_seconds,
        exercise: exercisesMap.get(item.exercise_id),
      }));

      setExercises(transformedExercises);
    } catch (err) {
      console.error('Error fetching routine data:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchRoutineData();
    }
  }, [slug, fetchRoutineData]);

  const handleStartRoutine = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowExerciseModal(true);
  }, []);

  const handleCloseExerciseModal = useCallback(() => {
    setShowExerciseModal(false);
  }, []);

  const handleCompleteRoutine = useCallback(() => {
    setShowExerciseModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleShareRoutine = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const shareUrl = `https://bend.com/routines/${slug}`;
      await Share.share({
        message: `Check out this ${routine?.name} routine on Bend: ${shareUrl}`,
        url: shareUrl,
        title: `${routine?.name} - Bend App`,
      });
    } catch (error) {
      console.error('Error sharing routine:', error);
    }
  }, [slug, routine?.name]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleDurationChange = useCallback((exerciseId: string, newDuration: number) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.exercise_id === exerciseId
          ? { ...exercise, duration_seconds: newDuration }
          : exercise
      )
    );
  }, []);

  const handlePressFavorite = useCallback(async () => {
    if (!routine) return;

    if (routine.isCustom) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (isFavorite) {
        const success = await removeRoutine(routine.id);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const routineToSave: Omit<SavedRoutine, 'savedAt'> = {
          id: routine.id,
          name: routine.name,
          description: routine.description,
          total_duration_minutes: routine.total_duration_minutes,
          body_part_id: routine.body_part_id,
          slug: routine.slug,
          image_url: routine.image_url,
        };

        const success = await saveRoutine(routineToSave);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [routine, isFavorite]);

  const totalDuration = useMemo(
    () => exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0),
    [exercises]
  );

  const totalMinutes = useMemo(() => Math.floor(totalDuration / 60), [totalDuration]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !routine) {
    return <ErrorState error={error || ''} onBack={handleBack} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <Header handleBack={handleBack} routine={routine} />
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <View className='px-6 pt-4'>
          <RoutineInfo
            routine={routine}
            totalMinutes={totalMinutes}
            onPressFavorite={handlePressFavorite}
            isFavorite={isFavorite}
          />
          <SectionTitle />
        </View>
        {exercises.map((routineExercise, index) => (
          <ExerciseCard
            key={routineExercise.id}
            exercise={routineExercise.exercise}
            duration={routineExercise.duration_seconds}
            sequence={index + 1}
            onDurationChange={handleDurationChange}
          />
        ))}
      </ScrollView>
      <ActionButtons onShare={handleShareRoutine} onStart={handleStartRoutine} />

      {showExerciseModal && (
        <ExerciseModal
          visible={showExerciseModal}
          exercises={exercises}
          onClose={handleCloseExerciseModal}
          onComplete={handleCompleteRoutine}
          routineName={routine?.name}
          routineSlug={routine?.slug}
        />
      )}
    </SafeAreaView>
  );
};

export default RoutineDetail;
