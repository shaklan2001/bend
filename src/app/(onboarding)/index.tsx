import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { View, Text, Animated, TouchableOpacity, StatusBar, Platform, Image, ImageSourcePropType, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fonts, FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';

type ScreenType = 'info' | 'single-choice-question' | 'multi-choice-question';
type AnswerKey = 'stretchTime' | 'painAreas' | 'activityLevel' | 'goals' | 'experienceLevel' | 'consultationType';

interface Screen {
    type: ScreenType;
    title: string;
    subtitle?: string;
    key?: AnswerKey;
    options?: string[];
    image?: ImageSourcePropType
}

const screens: Screen[] = [
    {
        type: 'info',
        title: 'Welcome to Bend',
        subtitle: 'Our mission is to help you stretch every day.',
    },
    {
        type: 'info',
        title: 'Stretching is important.',
        subtitle: 'Every time you stretch, you invest in your long-term health and longevity.',
        image: require('../../../assets/yoga/images_2.png')
    },
    {
        type: 'info',
        title: 'You\'re in the right place.',
        subtitle: 'Whether you\'re younger or older, a beginner or an expert — our simple, daily routines are designed for everyone.',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (1).png')
    },
    {
        type: 'info',
        title: 'Consistency is key.',
        subtitle: 'It\'s important to stretch every day. Bend is a simple way to make stretching a part of your daily routine.',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (2).png')
    },
    {
        type: 'single-choice-question',
        key: 'stretchTime',
        title: 'When is a good time for your daily stretch?',
        subtitle: 'Choose an option to continue',
        options: ['After waking up', 'After morning coffee or tea', 'After exercising', 'Before showering', 'During work break', 'Before going to bed', 'Other'],
    },
    {
        type: 'multi-choice-question',
        key: 'painAreas',
        title: 'Which areas of your body experience pain or discomfort?',
        subtitle: 'This helps us recommend safe exercises',
        options: ['Neck & Shoulders', 'Lower Back', 'Hips & Glutes', 'Knees', 'Ankles & Feet', 'Wrists & Hands', 'No pain currently'],
    },
    {
        type: 'single-choice-question',
        key: 'activityLevel',
        title: 'How active are you currently?',
        subtitle: 'Be honest - this helps us create the right routine',
        options: ['Very active (exercise 4+ times/week)', 'Moderately active (exercise 2-3 times/week)', 'Lightly active (exercise 1-2 times/week)', 'Sedentary (little to no exercise)', 'Recovering from injury'],
    },
    {
        type: 'multi-choice-question',
        key: 'goals',
        title: 'What are your main stretching goals?',
        subtitle: 'Select all that apply',
        options: ['Reduce pain & stiffness', 'Improve flexibility', 'Better posture', 'Recovery after exercise', 'Stress relief', 'Injury prevention', 'General wellness'],
    },
    {
        type: 'single-choice-question',
        key: 'experienceLevel',
        title: 'What\'s your experience with stretching?',
        subtitle: 'This helps us set the right difficulty level',
        options: ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced', 'Professional athlete'],
    },
    {
        type: 'single-choice-question',
        key: 'consultationType',
        title: 'What type of recommendations would you prefer?',
        subtitle: 'Choose your consultation style',
        options: ['AI-powered personalized routines', 'Expert-curated programs', 'Community recommendations', 'Hybrid approach (AI + expert review)'],
    },
    {
        type: 'info',
        title: 'Thanks for sharing.',
        subtitle: 'We\'ll let you know which exercises to be cautious about.',
        image: require('../../../assets/yoga/images_1.png')
    },
];

const InfoScreen = memo(({ title, subtitle, image }: { title: string; subtitle: string; image?: ImageSourcePropType }) => (
    <View style={{ alignItems: 'center', paddingBottom: 120 }}>
        <View style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: '#A69B8A',
            marginBottom: 32,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {image ? (
                <Image
                    source={image}
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover'
                    }}
                />
            ) : (
                <View style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 64,
                    backgroundColor: '#A69B8A'
                }} />
            )}
        </View>

        <Text style={[FontStyles.heading1, { color: '#000000', textAlign: 'center', marginBottom: 16 }]}>
            {title}
        </Text>
        <Text style={[FontStyles.bodyLarge, { color: '#6B7280', textAlign: 'center' }]}>
            {subtitle}
        </Text>
    </View>
));

const QuestionScreen = memo(({
    title,
    subtitle,
    options,
    answers,
    onAnswer,
    questionKey,
    questionType
}: {
    title: string;
    subtitle?: string;
    options?: string[];
    answers: any;
    onAnswer: (key: AnswerKey, value: string, type: string) => void;
    questionKey?: string;
    questionType?: string;
}) => (
    <View style={{ width: '100%', flex: 1, paddingTop: 20 }}>
        <Text style={[FontStyles.heading2, { color: '#000000', textAlign: 'center', marginBottom: 8, fontWeight: '600' }]}>
            {title}
        </Text>
        {subtitle && (
            <Text style={[FontStyles.bodyMedium, { color: '#6B7280', textAlign: 'center', marginBottom: 16 }]}>
                {subtitle}
            </Text>
        )}

        {questionType === 'multi-choice-question' && (
            <Text style={[FontStyles.bodySmall, { color: '#9CA3AF', textAlign: 'center', marginBottom: 24, fontStyle: 'italic' }]}>
                Select all that apply
            </Text>
        )}

        {options && questionKey && (
            <ScrollView
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {options.map((option) => {
                    const isSelected = questionType === 'single-choice-question'
                        ? answers[questionKey] === option
                        : answers[questionKey]?.includes(option);

                    return (
                        <TouchableOpacity
                            key={option}
                            style={{
                                width: '100%',
                                padding: 16,
                                borderWidth: 1,
                                borderRadius: 8,
                                marginBottom: 12,
                                backgroundColor: isSelected ? 'transparent' : '#A69B8A',
                                borderColor: isSelected ? '#A69B8A' : '#E5E7EB'
                            }}
                            onPress={() => questionKey && onAnswer(questionKey as AnswerKey, option, questionType || '')}
                            activeOpacity={0.7}
                        >
                            <Text style={[FontStyles.button, {
                                textAlign: 'center',
                                fontWeight: '400',
                                color: isSelected ? '#A69B8A' : '#FFFFFF'
                            }]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        )}
    </View>
));

const ProgressBar = memo(({ progress }: { progress: Animated.Value }) => (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
        <View style={{
            height: 4,
            backgroundColor: '#E5E7EB',
            borderRadius: 2,
            overflow: 'hidden'
        }}>
            <Animated.View
                style={{
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: '#A69B8A',
                    width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                    })
                }}
            />
        </View>
    </View>
));

const BackButton = memo(({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
        }}
        activeOpacity={0.7}
    >
        <Text style={{ fontSize: 28, color: '#6B7280', fontFamily: Fonts.bold }}>‹</Text>
    </TouchableOpacity>
));

const NextButton = memo(({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
            width: '100%',
            backgroundColor: '#F8F9FA',
            paddingVertical: 18,
            paddingHorizontal: 32,
            borderRadius: 56,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.24,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#E9ECEF',
        }}
    >
        <Text style={[FontStyles.button, {
            color: '#6C757D',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontWeight: '500',
            fontSize: 16,
        }]}>
            Next
        </Text>
    </TouchableOpacity>
));

const TapToContinue = memo(({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={[FontStyles.caption, {
            color: '#9CA3AF',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1
        }]}>
            Tap to continue
        </Text>
    </TouchableOpacity>
));

export default function OnboardingFlow() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{
        stretchTime: string | null;
        painAreas: string[];
        activityLevel: string | null;
        goals: string[];
        experienceLevel: string | null;
        consultationType: string | null;
    }>({
        stretchTime: null,
        painAreas: [],
        activityLevel: null,
        goals: [],
        experienceLevel: null,
        consultationType: null,
    });



    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const statusBarHeight = Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : StatusBar.currentHeight || 24;
    const navigationBarHeight = 60;
    const currentScreen = screens[currentIndex];

    const handleAnswer = useCallback((key: AnswerKey, value: string, type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (type === 'single-choice-question') {
            setAnswers(prev => ({ ...prev, [key]: value }));
        } else if (type === 'multi-choice-question') {
            setAnswers(prev => {
                const currentValues = prev[key] as string[];
                if (currentValues.includes(value)) {
                    return { ...prev, [key]: currentValues.filter(item => item !== value) };
                } else {
                    return { ...prev, [key]: [...currentValues, value] };
                }
            });
        }
    }, []);

    const handleNext = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (currentIndex < screens.length - 1) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start(() => {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);

                Animated.timing(progressAnim, {
                    toValue: nextIndex / (screens.length - 1),
                    duration: 800,
                    useNativeDriver: false,
                }).start();

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            await completeOnboarding();
        }
    }, [currentIndex, fadeAnim, progressAnim]);

    const handleBack = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (currentIndex > 0) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start(() => {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);

                Animated.timing(progressAnim, {
                    toValue: prevIndex / (screens.length - 1),
                    duration: 800,
                    useNativeDriver: false,
                }).start();

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [currentIndex, fadeAnim, progressAnim]);

    const completeOnboarding = useCallback(async () => {
        try {
            const onboardingData = {
                onboarding_completed: true,
                stretch_time: answers.stretchTime,
                pain_areas: answers.painAreas,
                activity_level: answers.activityLevel,
                goals: answers.goals,
                experience_level: answers.experienceLevel,
                consultation_type: answers.consultationType,
                completed_at: new Date().toISOString(),
                user_preferences: {
                    preferred_time: answers.stretchTime,
                    body_areas: answers.painAreas,
                    fitness_level: answers.activityLevel,
                    stretching_goals: answers.goals,
                    experience: answers.experienceLevel,
                    recommendation_style: answers.consultationType
                }
            };

            await AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData));
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            router.replace('/(tabs)');

        } catch (error) {
            console.error("Error completing onboarding:", error);
        }
    }, [answers, router]);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: currentIndex / (screens.length - 1),
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [currentIndex, progressAnim]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View
                style={{
                    position: 'absolute',
                    top: statusBarHeight,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    paddingBottom: 12,
                    height: navigationBarHeight
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%'
                }}>
                    {currentIndex > 0 ? (
                        <BackButton onPress={handleBack} />
                    ) : (
                        <View style={{ width: 40 }} />
                    )}

                    <ProgressBar progress={progressAnim} />

                    <View style={{ width: 40 }} />
                </View>
            </View>

            <View
                style={{
                    flex: 1,
                    paddingTop: statusBarHeight + navigationBarHeight,
                    paddingBottom: 100
                }}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 32
                    }}
                >
                    {currentScreen.type === 'info' ? (
                        <InfoScreen
                            title={currentScreen.title}
                            subtitle={currentScreen.subtitle || ''}
                            image={currentScreen.image}
                        />
                    ) : (
                        <QuestionScreen
                            title={currentScreen.title}
                            subtitle={currentScreen.subtitle}
                            options={currentScreen.options}
                            answers={answers}
                            onAnswer={handleAnswer}
                            questionKey={currentScreen.key}
                            questionType={currentScreen.type}
                        />
                    )}
                </Animated.View>

                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: 32,
                        paddingBottom: 40,
                        paddingTop: 20,
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    {currentScreen.type === 'info' ? (
                        <TapToContinue onPress={handleNext} />
                    ) : (
                        <NextButton
                            onPress={handleNext}
                        />
                    )}
                </Animated.View>
            </View>
        </View>
    );
}