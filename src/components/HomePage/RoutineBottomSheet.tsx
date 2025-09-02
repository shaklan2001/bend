import React, { memo, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    ScrollView,
    Animated,
    Dimensions,
    Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const { height: screenHeight } = Dimensions.get('window');

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
    exercises?: Exercise[];
}

type RoutineCardData = Routine | {
    id: string;
    name: string;
    description: string;
    total_duration_minutes: number;
    body_part_id: string;
    slug: string;
    image_url?: string;
    exercises?: Exercise[];
    savedAt?: number;
};

interface RoutineBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    bodyPart: {
        id: string;
        name: string;
        image_url: string;
    } | null;
    routines: Routine[];
    isLoading?: boolean;
}

export const RoutineCard = memo(({ routine, onPress }: {
    routine: RoutineCardData,
    onPress: (routine: RoutineCardData) => void
}) => {
    return (
        <TouchableOpacity
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress(routine);
            }}
            className="bg-white mb-5 flex-row items-center"
            activeOpacity={0.7}
        >
            <View
                className="w-[88px] h-[88px] rounded-3xl justify-center items-center mr-5"
                style={{
                    backgroundColor: '#FFFFFF',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6.84,
                    elevation: 5
                }}
            >
                <View
                    className="w-[56px] h-[56px] rounded-full justify-center items-center overflow-hidden"
                    style={{ backgroundColor: '#A69B8A2A' }}
                >
                    <Image
                        source={{ uri: routine?.image_url || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=Yoga' }}
                        className="w-[70px] h-[70px] rounded-full"
                    />
                </View>
            </View>

            <View className="flex-1 ml-2">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                    {routine.name}
                </Text>
                <Text className="text-lg font-bold text-[#A69B8A]">
                    {routine.total_duration_minutes} MINUTES
                </Text>
            </View>
        </TouchableOpacity>
    );
});

const Header = memo(({ bodyPartName, onClose }: { bodyPartName: string, onClose: () => void }) => (
    <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-100">
        <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full justify-center items-center"
            activeOpacity={0.6}
        >
            <Entypo name="cross" size={34} color="#D3D3D3" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900">
                {bodyPartName}
            </Text>
        </View>

        <View className="w-10" />
    </View>
));

const SectionTitle = memo(() => (
    <Text className="text-lg font-bold text-[#A69B8A9A] mb-6 uppercase tracking-wider">
        FLEXIBILITY
    </Text>
));

const LoadingState = memo(() => (
    <View className="py-10 items-center">
        <Text className="text-base text-gray-400">
            Loading routines...
        </Text>
    </View>
));

const EmptyState = memo(({ bodyPartName }: { bodyPartName: string }) => (
    <View className="py-10 items-center">
        <MaterialCommunityIcons
            name="yoga"
            size={64}
            color="#D1D5DB"
        />
        <Text className="text-base text-gray-400 mt-4 text-center">
            No routines available for {bodyPartName}
        </Text>
    </View>
));

const RoutineBottomSheet: React.FC<RoutineBottomSheetProps> = memo(({
    visible,
    onClose,
    bodyPart,
    routines,
    isLoading = false
}) => {
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);

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

    const handleRoutinePress = useCallback((routine: RoutineCardData) => {
        router.push(`/routine/${routine.slug}`);
        handleClose();
    }, [router, handleClose]);

    const shouldShowLoading = useMemo(() => isLoading, [isLoading]);
    const hasRoutines = useMemo(() => routines.length > 0, [routines]);
    const bodyPartName = useMemo(() => bodyPart?.name || '', [bodyPart?.name]);

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

    if (!bodyPart) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View
                className="flex-1 bg-black/50"
                style={{ opacity: fadeAnim }}
            >
                <Animated.View
                    className="absolute bottom-0 left-0 right-0 bg-white"
                    style={{
                        height: screenHeight,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <SafeAreaView className="flex-1">
                        <Header bodyPartName={bodyPartName} onClose={handleClose} />

                        <ScrollView
                            className="flex-1"
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingTop: 24,
                                paddingBottom: 40,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            <SectionTitle />

                            {shouldShowLoading ? (
                                <LoadingState />
                            ) : hasRoutines ? (
                                <View>
                                    {routines.map((routine) => (
                                        <RoutineCard
                                            key={routine.id}
                                            routine={routine}
                                            onPress={handleRoutinePress}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <EmptyState bodyPartName={bodyPartName} />
                            )}
                        </ScrollView>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

export default RoutineBottomSheet;

