import React, { memo, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';
import { FontStyles } from '../../lib/fonts';
import { VideoPlayer } from './VideoPlayer';

interface Exercise {
    id: string;
    name: string;
    description: string;
    image_url: string;
    video_url?: string;
}

interface ExerciseInfoModalProps {
    visible: boolean;
    exercise: Exercise | null;
    onClose: () => void;
    onPauseTimer?: () => void;
}

const exerciseInfoModalStyles = {
    headerTitle: {
        ...FontStyles.heading2,
        color: '#000000',
        fontWeight: '700' as const,
        flex: 1,
        textAlign: 'center' as const,
    },
    exerciseName: {
        ...FontStyles.heading2,
        color: '#000000',
        fontWeight: '700' as const,
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'center' as const,
    },
    sectionTitle: {
        ...FontStyles.bodyMedium,
        color: '#374151',
        fontWeight: '600' as const,
        marginBottom: 10,
        marginTop: 20,
    },
    description: {
        ...FontStyles.bodyMedium,
        color: '#6B7280',
        lineHeight: 24,
        marginBottom: 15,
    },
    noVideoText: {
        ...FontStyles.bodyMedium,
        color: '#9CA3AF',
        fontStyle: 'italic' as const,
        textAlign: 'center' as const,
    },
};

export const ExerciseInfoModal = memo(({
    visible,
    exercise,
    onClose,
    onPauseTimer
}: ExerciseInfoModalProps) => {
    if (!exercise) return null;

    useEffect(() => {
        if (visible && onPauseTimer) {
            onPauseTimer();
        }
    }, [visible, onPauseTimer]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <StatusBar style="dark" />
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View
                    className="bg-white rounded-t-2xl max-h-[80%]"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        elevation: 10,
                    }}
                >
                    <SafeAreaView>
                        <View className="w-10 h-1 bg-gray-300 rounded-sm self-center mt-3 mb-2" />

                        <View className="flex-row justify-between items-center px-5 pb-5 border-b border-gray-200">
                            <View className="w-8" />
                            <Text style={exerciseInfoModalStyles.headerTitle}>
                                Exercise Info
                            </Text>
                            <TouchableOpacity
                                className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center"
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Entypo name="cross" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
                            {exercise.video_url ? (
                                <View className="mt-2.5">
                                    <VideoPlayer videoUrl={exercise.video_url} />
                                </View>
                            ) : (
                                <View className="bg-gray-50 rounded-xl p-4 mt-2.5 min-h-[60px] justify-center items-center">
                                    <Text style={exerciseInfoModalStyles.noVideoText}>
                                        No video
                                    </Text>
                                </View>
                            )}
                            <Text style={exerciseInfoModalStyles.exerciseName}>
                                {exercise.name}
                            </Text>

                            <Text style={exerciseInfoModalStyles.sectionTitle}>
                                Description
                            </Text>
                            <Text style={exerciseInfoModalStyles.description}>
                                {exercise.description}
                            </Text>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
});
