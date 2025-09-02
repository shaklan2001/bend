import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';
import { FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { TimerCircle } from '@src/components/Instructions/TimerCircle';
import { CountdownOverlay } from '@src/components/Instructions/CountdownOverlay';
import { NextExercisePreview } from '@src/components/Instructions/NextExercisePreview';
import { ExerciseControls } from '@src/components/Instructions/ExerciseControls';
import { ExerciseInfoModal } from '@src/components/Instructions/ExerciseInfoModal';
import Header from '../UI/Header';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const containerSize = screenWidth * 0.85;
const imageSize = screenWidth * 0.8;
const borderRadius = screenWidth * 0.7;

interface Exercise {
    id: string;
    name: string;
    description: string;
    image_url: string;
    video_url?: string;
}

interface RoutineExercise {
    id: string;
    routine_id: string;
    exercise_id: string;
    sequence: number;
    duration_seconds: number;
    exercise: Exercise;
}

interface ExerciseModalProps {
    visible: boolean;
    exercises: RoutineExercise[];
    onClose: () => void;
    onComplete: () => void;
}

const ExerciseImage = memo(({
    exercise,
    showCountdown,
    countdownValue
}: {
    exercise: Exercise;
    showCountdown: boolean;
    countdownValue: number;
}) => {
    return (
        <View
            className="justify-center items-center self-center overflow-hidden relative"
            style={exerciseImageStyles.container}
        >
            <Image
                source={{ uri: exercise.image_url }}
                className="rounded-full"
                style={exerciseImageStyles.image}
                resizeMode="cover"
            />
        </View>
    );
});

const exerciseInfoStyles = StyleSheet.create({
    exerciseName: {
        ...FontStyles.heading2,
        color: '#000000',
        fontWeight: '700' as const,
        textAlign: 'center' as const,
        marginBottom: 8,
        fontSize: 28,
    },
    infoIcon: {
        shadowColor: '#A69B8A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3,
    },
});

const ExerciseInfo = memo(({
    exercise,
    onInfoPress
}: {
    exercise: Exercise;
    onInfoPress: () => void;
}) => {
    return (
        <View className="items-center px-6 mb-5">
            <View className="flex-row items-center">
                <Text style={exerciseInfoStyles.exerciseName}>
                    {exercise.name}
                </Text>
                <TouchableOpacity
                    className="absolute -right-8 top-0 w-[20px] h-[20px] rounded-full bg-white justify-center items-center ml-2"
                    style={exerciseInfoStyles.infoIcon}
                    activeOpacity={0.7}
                    onPress={onInfoPress}
                >
                    <Entypo name="info" size={10} color="#000000" />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const timerDisplayStyles = StyleSheet.create({
    timerText: {
        ...FontStyles.heading1,
        color: '#A69B8A',
        fontWeight: '700' as const,
        textAlign: 'center' as const,
        marginBottom: 30,
        lineHeight: 56,
        fontSize: 48,
        marginTop: 20,
    },
});

const TimerDisplay = memo(({
    remainingTime,
    totalTime
}: {
    remainingTime: number;
    totalTime: number;
}) => {
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return (
        <Text className="text-center mb-8 mt-5" style={timerDisplayStyles.timerText}>
            {formatTime(remainingTime)}
        </Text>
    );
});

export const ExerciseModal = memo(({
    visible,
    exercises,
    onClose,
    onComplete
}: ExerciseModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdownValue, setCountdownValue] = useState<number | string>(3);
    const [showNextPreview, setShowNextPreview] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [pausedTime, setPausedTime] = useState(0);

    const currentExercise = useMemo(() =>
        exercises[currentIndex],
        [exercises, currentIndex]
    );

    const [elapsedTime, setElapsedTime] = useState(0);

    const progress = useMemo(() => {
        if (!currentExercise) return 0;
        const totalDuration = currentExercise.duration_seconds;
        return Math.min(elapsedTime / totalDuration, 1);
    }, [currentExercise, elapsedTime]);

    const isLastExercise = useMemo(() =>
        currentIndex === exercises.length - 1,
        [currentIndex, exercises.length]
    );

    const nextExercise = useMemo(() =>
        !isLastExercise ? exercises[currentIndex + 1] : null,
        [exercises, currentIndex, isLastExercise]
    );

    const startCountdown = useCallback(() => {
        if (currentIndex === 0) {
            setShowCountdown(true);
            setCountdownValue(3);

            const countdownInterval = setInterval(() => {
                setCountdownValue(prev => {
                    if (typeof prev === 'number') {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            // Show "START" for 1 second
                            setCountdownValue("START");
                            setTimeout(() => {
                                setShowCountdown(false);
                                setCountdownValue(3);
                                // Add haptic feedback when exercise starts
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            }, 1000);
                            return "START";
                        }
                        return prev - 1;
                    }
                    return prev;
                });
            }, 1000);
        }
    }, [currentIndex]);

    const startExercise = useCallback(() => {
        if (currentExercise) {
            setRemainingTime(currentExercise.duration_seconds);
            setElapsedTime(0);
            setIsPaused(false);
            startCountdown();
        }
    }, [currentExercise, startCountdown]);

    const pauseExercise = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (!isPaused) {
            // Pausing - store the current elapsed time
            setPausedTime(elapsedTime);
        }
        setIsPaused(!isPaused);
    }, [isPaused, elapsedTime]);

    const nextExerciseAction = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isLastExercise) {
            onComplete();
        } else {
            setCurrentIndex(prev => prev + 1);
            setShowNextPreview(false);
        }
    }, [isLastExercise, onComplete]);

    const previousExerciseAction = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setShowNextPreview(false);
        }
    }, [currentIndex]);

    const handleInfoPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowInfoModal(true);
    }, []);

    const handleCloseInfoModal = useCallback(() => {
        setShowInfoModal(false);
    }, []);

    const handlePauseTimer = useCallback(() => {
        if (!isPaused) {
            setIsPaused(true);
        }
    }, [isPaused]);

    const handleResumeTimer = useCallback(() => {
        if (isPaused) {
            setIsPaused(false);
        }
    }, [isPaused]);

    useEffect(() => {
        if (!visible || !currentExercise || isPaused || showCountdown) return;

        const startTime = Date.now();
        const totalDuration = currentExercise.duration_seconds * 1000;
        const pausedDuration = pausedTime * 1000;

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime + pausedDuration;
            const remaining = Math.max(0, totalDuration - elapsed);
            const remainingSeconds = Math.ceil(remaining / 1000);
            const elapsedSeconds = Math.min(elapsed / 1000, currentExercise.duration_seconds);

            setRemainingTime(remainingSeconds);
            setElapsedTime(elapsedSeconds);

            if (remainingSeconds <= 5 && nextExercise) {
                setShowNextPreview(true);
            }

            if (remaining <= 0) {
                clearInterval(timer);
                setTimeout(() => {
                    if (isLastExercise) {
                        onComplete();
                    } else {
                        setCurrentIndex(prevIndex => prevIndex + 1);
                        setShowNextPreview(false);
                    }
                }, 1000);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [visible, currentExercise, isPaused, showCountdown, nextExercise, isLastExercise, onComplete, pausedTime]);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(0);
            setRemainingTime(0);
            setIsPaused(false);
            setShowCountdown(false);
            setCountdownValue(3);
            setShowNextPreview(false);
            setElapsedTime(0);
            setShowInfoModal(false);
            setPausedTime(0);
        }
    }, [visible]);

    useEffect(() => {
        if (currentExercise && visible) {
            startExercise();
        }
    }, [currentExercise, visible, startExercise]);

    if (!visible || !currentExercise) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
        >
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1">
                <View className="flex-1 bg-white">
                    <Header onClose={onClose} title={`${currentIndex + 1} of ${exercises.length}`} />

                    <View className="flex-1 mt-2.5">
                        <View className="relative items-center justify-center">
                            <ExerciseImage
                                exercise={currentExercise.exercise}
                                showCountdown={showCountdown}
                                countdownValue={countdownValue}
                            />

                            <TimerCircle
                                progress={progress}
                                size={screenWidth * 0.87}
                            />
                        </View>

                        {showNextPreview && nextExercise && (
                            <NextExercisePreview exercise={nextExercise.exercise} />
                        )}

                        <ExerciseInfo
                            exercise={currentExercise.exercise}
                            onInfoPress={handleInfoPress}
                        />

                        <TimerDisplay
                            remainingTime={remainingTime}
                            totalTime={currentExercise.duration_seconds}
                        />
                    </View>

                    <ExerciseControls
                        isPaused={isPaused}
                        onPause={pauseExercise}
                        onPrevious={previousExerciseAction}
                        onNext={nextExerciseAction}
                        canGoPrevious={currentIndex > 0}
                        isLastExercise={isLastExercise}
                    />
                </View>
            </SafeAreaView>

            {showCountdown && (
                <CountdownOverlay value={countdownValue} />
            )}

            <ExerciseInfoModal
                visible={showInfoModal}
                exercise={currentExercise?.exercise || null}
                onClose={handleCloseInfoModal}
                onPauseTimer={handlePauseTimer}
                onResumeTimer={handleResumeTimer}
            />
        </Modal>
    );
});

const exerciseImageStyles = StyleSheet.create({
    container: {
        width: containerSize,
        height: containerSize,
        borderRadius: borderRadius,
        backgroundColor: '#FFFFFF',
        marginVertical: 20,
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: borderRadius,
    },
});

