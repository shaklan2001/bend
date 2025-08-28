import { View, Text, SafeAreaView, Animated, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState, memo } from 'react';
import Button from '../components/Button';
import { FontStyles } from '../lib/fonts';
import { checkOnboardingStatus } from '../lib/supabase';

const CircleStep = memo(({ circleScale }: { circleScale: Animated.Value }) => (
    <View className="flex-1 justify-center items-center">
        <Animated.View
            style={{
                transform: [{ scale: circleScale }],
                backgroundColor: '#A69B8A'
            }}
            className="w-32 h-32 rounded-full mr-8"
        />
    </View>
));

const LogoStep = memo(({
    circleScale,
    circleMoveX,
    textSlideX,
    textOpacity
}: {
    circleScale: Animated.Value;
    circleMoveX: Animated.Value;
    textSlideX: Animated.Value;
    textOpacity: Animated.Value;
}) => (
    <View className="flex-1 justify-center items-center">
        <View className="items-center">
            <View className="flex-row items-center">
                <Animated.View
                    style={{
                        transform: [
                            { scale: circleScale },
                            { translateX: circleMoveX }
                        ],
                        backgroundColor: '#A69B8A'
                    }}
                    className="w-32 h-32 rounded-full mr-1"
                />
                <Animated.View
                    style={{
                        transform: [{ translateX: textSlideX }],
                        opacity: textOpacity
                    }}
                >
                    <Text style={[FontStyles.logo, { color: '#000000' }]}>
                        bend
                    </Text>
                </Animated.View>
            </View>
        </View>
    </View>
));

const ReferralCodeModal = memo(({
    visible,
    onClose,
    referralCode,
    setReferralCode
}: {
    visible: boolean;
    onClose: () => void;
    referralCode: string;
    setReferralCode: (code: string) => void;
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl px-6 py-12 min-h-[400px]">
                    <View className="items-center mb-8">
                        <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
                        <Text style={[FontStyles.heading3, { color: '#000000' }]}>
                            Enter Referral Code
                        </Text>
                    </View>

                    <TextInput
                        value={referralCode}
                        onChangeText={setReferralCode}
                        className="w-full px-4 py-4 border border-gray-300 rounded-full text-center text-lg bg-white mb-8"
                        placeholder="Referral Code"
                        placeholderTextColor="#9CA3AF"
                        autoFocus
                    />

                    <View className="flex-row space-x-4">
                        <Button
                            title="Cancel"
                            onPress={onClose}
                            variant="outline"
                            className="flex-1 py-3 px-6 rounded-full border-2"
                            style={{ borderColor: '#E5E7EB' }}
                            textClassName="text-gray-600 text-base font-semibold"
                        />
                        <Button
                            title="Apply"
                            onPress={onClose}
                            className="py-3 px-6 rounded-full"
                            style={{ backgroundColor: '#A69B8A' }}
                            textClassName="text-white text-base font-semibold"
                        />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    </Modal>
));

export default function IntroScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [referralCode, setReferralCode] = useState('');
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    const circleScale = useRef(new Animated.Value(0)).current;
    const circleMoveX = useRef(new Animated.Value(0)).current;
    const textSlideX = useRef(new Animated.Value(300)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const finalScreenOpacity = useRef(new Animated.Value(0)).current;

    const checkOnboardingStatusLocal = async () => {
        try {
            const { completed } = await checkOnboardingStatus();
            setOnboardingCompleted(completed);
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            setOnboardingCompleted(false);
        }
    };

    useEffect(() => {
        checkOnboardingStatusLocal();
    }, []);

    const handleGetStarted = () => {
        router.push('/(onboarding)');
    };

    const handleLogin = () => {
        console.log('Login pressed');
    };

    const handleReferralCodePress = () => {
        setShowReferralModal(true);
    };

    const closeReferralModal = () => {
        setShowReferralModal(false);
    };

    useEffect(() => {
        circleScale.setValue(1.5);
        circleMoveX.setValue(8);
        textSlideX.setValue(300);
        textOpacity.setValue(0);
        finalScreenOpacity.setValue(0);

        setTimeout(() => {
            setCurrentStep(1);
        }, 500);

        setTimeout(() => {
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            Animated.parallel([
                Animated.spring(circleScale, {
                    toValue: 0.75,
                    useNativeDriver: true,
                    tension: 30,
                    friction: 9,
                }),
                Animated.spring(circleMoveX, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 30,
                    friction: 10,
                }),
                Animated.spring(textSlideX, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 30,
                    friction: 9,
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setCurrentStep(2);
                
                // Only proceed to step 3 if onboarding is not completed
                if (!onboardingCompleted) {
                    // Show buttons for incomplete onboarding
                    setTimeout(() => {
                        Animated.timing(finalScreenOpacity, {
                            toValue: 1,
                            duration: 800,
                            useNativeDriver: true,
                        }).start(() => {
                            setCurrentStep(3);
                        });
                    }, 1500);
                } else {
                    // Navigate to home screen after animation for completed onboarding
                    setTimeout(() => {
                        router.push('/(tabs)');
                    }, 1000);
                }
            });
        }, 1500);
    }, [onboardingCompleted]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {currentStep === 0 && <CircleStep circleScale={circleScale} />}
            {currentStep === 1 && (
                <LogoStep
                    circleScale={circleScale}
                    circleMoveX={circleMoveX}
                    textSlideX={textSlideX}
                    textOpacity={textOpacity}
                />
            )}
            {currentStep >= 2 && (
                <View className="flex-1">
                    <View className="absolute inset-0 justify-center items-center">
                        <View className="items-center">
                            <View className="flex-row items-center">
                                <Animated.View
                                    style={{
                                        transform: [
                                            { scale: circleScale },
                                            { translateX: circleMoveX }
                                        ],
                                        backgroundColor: '#A69B8A'
                                    }}
                                    className="w-32 h-32 rounded-full mr-1"
                                />
                                <Text style={[FontStyles.logo, { color: '#000000' }]}>
                                    bend
                                </Text>
                            </View>
                        </View>
                    </View>

                    {!onboardingCompleted && (
                        <Animated.View
                            style={{ opacity: finalScreenOpacity }}
                            className="absolute bottom-0 left-0 right-0 px-8 pb-8"
                        >
                            <TouchableOpacity
                                onPress={handleReferralCodePress}
                                className="w-full mb-4"
                                activeOpacity={0.7}
                            >
                                <Text style={[FontStyles.bodyMedium, { color: '#9CA3AF', textAlign: 'center' }]}>
                                    Enter Referral Code
                                </Text>
                            </TouchableOpacity>

                            <View className="w-full">
                                <Button
                                    title="GET STARTED"
                                    onPress={handleGetStarted}
                                    className="py-4 px-8 rounded-full w-full mb-2"
                                    style={{ backgroundColor: '#A69B8A' }}
                                    textClassName="text-white text-lg font-semibold tracking-wider"
                                />

                                <Button
                                    title="LOG IN"
                                    onPress={handleLogin}
                                    variant="outline"
                                    className="border-2 py-4 px-8 rounded-full w-full bg-transparent"
                                    style={{ borderColor: '#E5E7EB' }}
                                    textClassName="text-gray-600 text-lg font-semibold tracking-wider"
                                />
                            </View>

                            <View className="mt-1 px-4">
                                <Text style={[FontStyles.bodyXSmall, { color: '#9CA3AF', textAlign: 'center' }]}>
                                    By continuing, you agree to our Privacy Policy{'\n'}and Terms of Use.
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                </View>
            )}

            <ReferralCodeModal
                visible={showReferralModal}
                onClose={closeReferralModal}
                referralCode={referralCode}
                setReferralCode={setReferralCode}
            />
        </SafeAreaView>
    );
}