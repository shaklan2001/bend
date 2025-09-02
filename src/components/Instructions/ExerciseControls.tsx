import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ExerciseControlsProps {
    isPaused: boolean;
    onPause: () => void;
    onPrevious: () => void;
    onNext: () => void;
    canGoPrevious: boolean;
    isLastExercise: boolean;
}

const exerciseControlsStyles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 3,
    },
    centerButton: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 3,
    },
    disabledButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.,
        shadowRadius: 15,
        elevation: 2,
        opacity: 0.3,
    },
});

export const ExerciseControls = memo(({
    isPaused,
    onPause,
    onPrevious,
    onNext,
    canGoPrevious,
    isLastExercise,
}: ExerciseControlsProps) => {

    const handlePrevious = () => {
        if (canGoPrevious) {
            onPrevious();
        }
    };

    const handleNext = () => {
        onNext();
    };

    const handlePause = () => {
        onPause();
    };

    return (
        <View className="flex-row justify-center items-center px-6 py-5 mb-2.5 gap-8">
            <TouchableOpacity
                onPress={handlePrevious}
                className="justify-center items-center"
                style={canGoPrevious ? exerciseControlsStyles.button : exerciseControlsStyles.disabledButton}
                activeOpacity={0.7}
                disabled={!canGoPrevious}
            >
                <Entypo
                    name="controller-jump-to-start"
                    size={30}
                    color={canGoPrevious ? "#000000" : "#D1D5DB"}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handlePause}
                className="justify-center items-center"
                style={exerciseControlsStyles.centerButton}
                activeOpacity={0.7}
            >
                <Entypo
                    name={isPaused ? "controller-play" : "controller-paus"}
                    size={45}
                    color="#000000"
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleNext}
                className="justify-center items-center"
                style={exerciseControlsStyles.button}
                activeOpacity={0.7}
            >
                <Entypo
                    name="controller-next"
                    size={30}
                    color="#000000"
                />
            </TouchableOpacity>
        </View>
    );
});
