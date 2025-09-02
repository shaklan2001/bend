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
    TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { NextButton } from '@src/components/Shared/NextButton';
import Gravity from '../UI/Gravity';
import Header from '../UI/Header';

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

interface DesignCoverModalProps {
    visible: boolean;
    onClose: () => void;
    exercises: ExerciseWithDuration[];
    onFinish: (routineData: {
        name: string;
        exercises: ExerciseWithDuration[];
        coverImage: string;
    }) => void;
}

// Cover Preview Component
const CoverPreview = memo(({ exercises, selectedCoverImage, routineName }: {
    exercises: ExerciseWithDuration[];
    selectedCoverImage: string;
    routineName: string;
}) => {
    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0);
    const totalMinutes = Math.floor(totalDuration / 60);

    return (
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            marginBottom: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
        }}>
            {/* Exercise Icons Row */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                gap: 8,
            }}>
                {/* Show up to 5 exercise icons */}
                {exercises.slice(0, 5).map((exercise, index) => (
                    <View key={exercise.id} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: index === 0 ? '#FCE7F3' :
                            index === 1 ? '#A69B8A' :
                                index === 2 ? '#FEF3C7' : '#F3F4F6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}>
                        <Image
                            source={{ uri: exercise.image_url }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            }}
                            resizeMode="cover"
                        />
                    </View>
                ))}
                {/* Add placeholder circles if less than 5 exercises */}
                {Array.from({ length: Math.max(0, 5 - exercises.length) }).map((_, index) => (
                    <View key={`placeholder-${index}`} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#F3F4F6',
                        borderWidth: 2,
                        borderColor: '#E5E7EB',
                        borderStyle: 'dashed',
                    }} />
                ))}
            </View>

            {/* Routine Name */}
            <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                marginBottom: 8,
            }}>
                {routineName || 'Custom'}
            </Text>

            {/* Duration */}
            <Text style={{
                fontSize: 16,
                color: '#6B7280',
                textAlign: 'center',
                fontWeight: '500',
            }}>
                {totalMinutes} MINUTES
            </Text>
        </View>
    );
});

// Photo Selection Component
const PhotoSelector = memo(({ exercises, selectedCoverImage, onSelectCover }: {
    exercises: ExerciseWithDuration[];
    selectedCoverImage: string;
    onSelectCover: (imageUrl: string) => void;
}) => {
    // Use exercise images as cover options
    const coverOptions = exercises.slice(0, 4).map(exercise => exercise.image_url);

    return (
        <View style={{ marginBottom: 32 }}>
            <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#6B7280',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
            }}>
                SELECT PHOTOS
            </Text>

            <View style={{
                flexDirection: 'row',
                gap: 12,
            }}>
                {coverOptions.map((imageUrl, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelectCover(imageUrl)}
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: index === 0 ? '#FCE7F3' :
                                index === 1 ? '#A69B8A' :
                                    index === 2 ? '#FEF3C7' : '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: selectedCoverImage === imageUrl ? 3 : 0,
                            borderColor: '#3B82F6',
                            overflow: 'hidden',
                        }}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: imageUrl }}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                            }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
});

const DesignCoverModal = memo(({
    visible,
    onClose,
    exercises,
    onFinish
}: DesignCoverModalProps) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [selectedCoverImage, setSelectedCoverImage] = useState('');

    // Set default cover image to first exercise
    useEffect(() => {
        if (exercises.length > 0 && !selectedCoverImage) {
            setSelectedCoverImage(exercises[0].image_url);
        }
    }, [exercises, selectedCoverImage]);

    const handleFinish = useCallback(() => {
        if (!routineName.trim()) {
            // Show error or use default name
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        onFinish({
            name: routineName.trim(),
            exercises,
            coverImage: selectedCoverImage,
        });

        onClose();
    }, [routineName, exercises, selectedCoverImage, onFinish, onClose]);

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
                        <Header title="Design Cover" onClose={handleClose} />

                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingTop: 24,
                                paddingBottom: 120,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Cover Preview */}
                            <CoverPreview
                                exercises={exercises}
                                selectedCoverImage={selectedCoverImage}
                                routineName={routineName}
                            />

                            {/* Choose Name Section */}
                            <View style={{ marginBottom: 32 }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: '#6B7280',
                                    marginBottom: 16,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}>
                                    CHOOSE NAME
                                </Text>

                                <TextInput
                                    value={routineName}
                                    onChangeText={setRoutineName}
                                    placeholder="e.g. Morning Ritual"
                                    placeholderTextColor="#9CA3AF"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        paddingVertical: 16,
                                        fontSize: 16,
                                        color: '#111827',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                            </View>

                            {/* Photo Selection */}
                            <PhotoSelector
                                exercises={exercises}
                                selectedCoverImage={selectedCoverImage}
                                onSelectCover={setSelectedCoverImage}
                            />
                        </ScrollView>

                        {/* Bottom Button */}
                        <Gravity>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                paddingHorizontal: 24,
                                paddingVertical: 20,
                            }}>
                                <NextButton
                                    onPress={handleFinish}
                                    title="FINISH"
                                />
                            </View>
                        </Gravity>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

export default DesignCoverModal;
