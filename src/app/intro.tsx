import { View, Text, SafeAreaView, Animated, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState, memo } from 'react';
import Button from '../components/Button';

// Step 1: Big circle in center (1.5X size) - no animation
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

// Step 2: Circle moves right + becomes smaller + bend text appears (synchronized)
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
                    <Text
                        style={{
                            fontSize: 64,
                            fontWeight: '500',
                            color: '#000000',
                            fontFamily: 'System'
                        }}
                    >
                        bend
                    </Text>
                </Animated.View>
            </View>
        </View>
    </View>
));

// Referral Code Bottom Sheet Modal
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
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '600',
                                color: '#000000',
                                fontFamily: 'System'
                            }}
                        >
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
                            className="flex-1 py-3 px-6 rounded-full"
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

    const circleScale = useRef(new Animated.Value(0)).current;
    const circleMoveX = useRef(new Animated.Value(0)).current;
    const textSlideX = useRef(new Animated.Value(300)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const finalScreenOpacity = useRef(new Animated.Value(0)).current;



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

    // Initialize animations
    useEffect(() => {
        // Set initial values
        circleScale.setValue(1.5); // Start at 1.5X size immediately
        circleMoveX.setValue(8);   // Start slightly right to compensate for mr-2 margin
        textSlideX.setValue(300);
        textOpacity.setValue(0);
        finalScreenOpacity.setValue(0);

        // Step 1: Circle already visible at 1.5X size in center (no animation needed)
        setTimeout(() => {
            setCurrentStep(1);
        }, 500);

        // Step 2: Circle becomes smaller + moves left + bend text appears (synchronized)
        setTimeout(() => {
            // Trigger haptic feedback for iOS
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            Animated.parallel([
                // Circle scales down from 1.5X to 0.75X (smaller size)
                Animated.spring(circleScale, {
                    toValue: 0.75,
                    useNativeDriver: true,
                    tension: 30,
                    friction: 9,
                }),
                // Circle moves LEFT to make space for text
                Animated.spring(circleMoveX, {
                    toValue: 0, // Move to final left position
                    useNativeDriver: true,
                    tension: 30,
                    friction: 10,
                }),
                // Text slides in from right
                Animated.spring(textSlideX, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 30,
                    friction: 9,
                }),
                // Text fades in
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setCurrentStep(2);
            });
        }, 1500);

        // Step 3: Fade in the buttons and referral code
        setTimeout(() => {
            Animated.timing(finalScreenOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start(() => {
                setCurrentStep(3);
            });
        }, 3000);
    }, []);

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
                                <Text
                                    style={{
                                        fontSize: 64,
                                        fontWeight: '500',
                                        color: '#000000',
                                        fontFamily: 'Poppins-Bold'
                                    }}
                                >
                                    bend
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Fade in the buttons and referral code at bottom */}
                    <Animated.View
                        style={{ opacity: finalScreenOpacity }}
                        className="absolute bottom-0 left-0 right-0 px-8 pb-8"
                    >
                        {/* Referral Code section */}
                        <TouchableOpacity
                            onPress={handleReferralCodePress}
                            className="w-full mb-4"
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#9CA3AF',
                                    textAlign: 'center',
                                    fontFamily: 'System'
                                }}
                            >
                                Enter Referral Code
                            </Text>
                        </TouchableOpacity>

                        {/* Buttons section */}
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

                        {/* Footer text */}
                        <View className="mt-1 px-4">
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#9CA3AF',
                                    textAlign: 'center',
                                    lineHeight: 18,
                                    fontFamily: 'System'
                                }}
                            >
                                By continuing, you agree to our Privacy Policy{'\n'}and Terms of Use.
                            </Text>
                        </View>
                    </Animated.View>
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