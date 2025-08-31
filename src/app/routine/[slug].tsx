import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';


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
}

interface RoutineExercise {
    id: string;
    routine_id: string;
    exercise_id: string;
    sequence: number;
    duration_seconds: number;
    exercise: Exercise;
}

const ExerciseCard = ({ exercise, duration, sequence }: {
    exercise: Exercise,
    duration: number,
    sequence: number
}) => {
    const [durationValue, setDurationValue] = useState(duration);

    const handleDurationChange = (increment: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (increment) {
            setDurationValue(prev => Math.min(prev + 30, 300)); // Max 5 minutes
        } else {
            setDurationValue(prev => Math.max(prev - 30, 15)); // Min 15 seconds
        }
    };

    return (
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        }}>
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                overflow: 'hidden',
            }}>
                <Image
                    source={{ uri: exercise?.image_url }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                    resizeMode="cover"
                />
            </View>

            <View className="flex-1">
                <Text style={[FontStyles.bodyLarge, {
                    color: '#000000',
                    fontWeight: '700',
                    marginBottom: 4,
                }]}>
                    {exercise?.name}
                </Text>
            </View>

            <View className="items-center">
                <Text style={[FontStyles.bodyMedium, {
                    color: '#6B7280',
                    fontWeight: '600',
                    marginBottom: 8,
                }]}>
                    {Math.floor(durationValue / 60)}:{(durationValue % 60).toString().padStart(2, '0')}
                </Text>
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity
                        onPress={() => handleDurationChange(false)}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="minus" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDurationChange(true)}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="plus" size={16} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const RoutineDetail = () => {
    const { slug } = useLocalSearchParams();
    const router = useRouter();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [exercises, setExercises] = useState<RoutineExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchRoutineData();
        }
    }, [slug]);

    const fetchRoutineData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const routineSlug = slug as string;

            const { data: routineData, error: routineError } = await supabase
                .from('routines')
                .select('*')
                .eq('slug', routineSlug)
                .single();

            if (routineError) {
                throw new Error('Routine not found');
            }

            setRoutine(routineData);

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

            console.log('Exercises data:', exercisesData);

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
                exercise: exercisesMap.get(item.exercise_id)
            }));

            setExercises(transformedExercises);
        } catch (err) {
            console.error('Error fetching routine data:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartRoutine = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleShareRoutine = async () => {
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
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 justify-center items-center">
                    <Text style={[FontStyles.bodyLarge, { color: '#9CA3AF' }]}>
                        Loading routine...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !routine) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 justify-center items-center px-6">
                    <MaterialCommunityIcons
                        name="alert-circle"
                        size={64}
                        color="#EF4444"
                    />
                    <Text style={[FontStyles.heading2, {
                        color: '#EF4444',
                        textAlign: 'center',
                        marginTop: 16
                    }]}>
                        {error || 'Routine not found'}
                    </Text>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={{
                            marginTop: 24,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            backgroundColor: '#EF4444',
                            borderRadius: 8,
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0);
    const totalMinutes = Math.floor(totalDuration / 60);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
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
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#6B7280" />
                </TouchableOpacity>

                <View className="flex-1 items-center">
                    <Text style={[FontStyles.heading2, {
                        color: '#000000',
                        fontWeight: '700',
                        textAlign: 'center',
                        opacity: 0.8
                    }]}>
                        {routine.name}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
                    <Text style={[FontStyles.bodyMedium, {
                        color: '#6B7280',
                        fontWeight: '500',
                        marginTop: 4
                    }]}>
                        {totalMinutes} minutes
                    </Text>
                {routine.description && (
                    <Text style={[FontStyles.bodyMedium, {
                        color: '#6B7280',
                        marginBottom: 24,
                        lineHeight: 24,
                    }]}>
                        {routine.description}
                    </Text>
                )}

                <Text style={[FontStyles.bodyMedium, {
                    color: '#A69B8A',
                    fontWeight: '700',
                    marginBottom: 20,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: 16,
                }]}>
                    EXERCISES
                </Text>

                {exercises.map((routineExercise, index) => (
                    <ExerciseCard
                        key={routineExercise.id}
                        exercise={routineExercise.exercise}
                        duration={routineExercise.duration_seconds}
                        sequence={index + 1}
                    />
                ))}
            </ScrollView>

            <View className="px-6 py-4 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleShareRoutine}
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        borderRadius: 12,
                        paddingVertical: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="share-variant"
                        size={20}
                        color="#6B7280"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: '#6B7280', fontWeight: '600' }}>
                        Share Routine
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleStartRoutine}
                    style={{
                        borderRadius: 12,
                        paddingVertical: 16,
                        overflow: 'hidden',
                    }}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={['#3B82F6', '#1D4ED8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 12,
                        }}
                    />
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 18,
                        fontWeight: '700',
                        textAlign: 'center',
                    }}>
                        START
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default RoutineDetail;
