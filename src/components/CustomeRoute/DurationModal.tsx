import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    ScrollView,
    Animated,
    Dimensions,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { NextButton } from '@src/components/Shared/NextButton';
import { ExerciseDurationCard } from '@src/components/Shared/ExerciseDurationCard';
import Gravity from '../UI/Gravity';
import Header from '../UI/Header';
import DesignCoverModal from './DesignCoverModal';
import { saveCustomRoutine } from '../../lib/customRoutines';

const { height: screenHeight } = Dimensions.get('window');

interface Exercise {
    id: string;
    name: string;
    description: string;
    image_url: string;
    video_url?: string;
}

interface ExerciseWithDuration extends Exercise {
    duration_seconds: number;
    sequence: number;
}

interface DurationModalProps {
    visible: boolean;
    onClose: () => void;
    exercises: ExerciseWithDuration[];
    onSave: (exercises: ExerciseWithDuration[]) => void;
}



const DurationModal = memo(({
    visible,
    onClose,
    exercises,
    onSave
}: DurationModalProps) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);
    const [exercisesWithDuration, setExercisesWithDuration] = useState<ExerciseWithDuration[]>([]);
    const [isDesignCoverModalVisible, setIsDesignCoverModalVisible] = useState(false);

    useEffect(() => {
        if (exercises.length > 0) {
            setExercisesWithDuration(exercises.map(exercise => ({
                ...exercise,
                duration_seconds: exercise.duration_seconds || 30,
                sequence: exercise.sequence || 1,
            })));
        }
    }, [exercises]);

    const handleDurationChange = useCallback((exerciseId: string, newDuration: number) => {
        setExercisesWithDuration(prev =>
            prev.map(exercise =>
                exercise.id === exerciseId
                    ? { ...exercise, duration_seconds: newDuration }
                    : exercise
            )
        );
    }, []);

    const handleSave = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsDesignCoverModalVisible(true);
    }, []);

    const handleDesignCoverFinish = useCallback(async (routineData: {
        name: string;
        exercises: ExerciseWithDuration[];
        coverImage: string;
    }) => {
        console.log('Routine created:', routineData);

        try {
            const totalDuration = routineData.exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0);

            const success = await saveCustomRoutine({
                name: routineData.name,
                coverImage: routineData.coverImage,
                exercises: routineData.exercises,
                totalDuration,
            });

            if (success) {
                console.log('Custom routine saved successfully');
                onSave(routineData.exercises);
                onClose();
            } else {
                console.error('Failed to save custom routine');
            }
        } catch (error) {
            console.error('Error saving custom routine:', error);
        }
    }, [onSave, onClose]);

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
    }, [visible, isClosing, slideAnim, fadeAnim]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <StatusBar style="dark" />

            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    opacity: fadeAnim,
                }}
            >
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        height: screenHeight,
                        transform: [{ translateY: slideAnim }],
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header title="Choose Lengths" onClose={handleClose} />

                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                paddingBottom: 120,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {exercisesWithDuration.map((exercise, index) => (
                                <ExerciseDurationCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    duration={exercise.duration_seconds}
                                    onDurationChange={handleDurationChange}
                                    showDurationControls={true}
                                />
                            ))}
                        </ScrollView>

                        <Gravity>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                paddingHorizontal: 24,
                                paddingVertical: 20,
                            }}>
                                <NextButton onPress={handleSave} />
                            </View>
                        </Gravity>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>

            {/* Design Cover Modal */}
            <DesignCoverModal
                visible={isDesignCoverModalVisible}
                onClose={() => setIsDesignCoverModalVisible(false)}
                exercises={exercisesWithDuration}
                onFinish={handleDesignCoverFinish}
            />
        </Modal>
    );
});

export default DurationModal;
