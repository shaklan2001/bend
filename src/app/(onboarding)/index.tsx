import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fonts, FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { AnswerKey, screens } from '../../lib/constant';
import { NextButton } from '@src/components/Shared/NextButton';
import Gravity from '@src/components/UI/Gravity';

const InfoScreen = memo(
  ({
    title,
    subtitle,
    image,
  }: {
    title: string;
    subtitle: string;
    image?: ImageSourcePropType;
  }) => (
    <View style={{ alignItems: 'center', paddingBottom: 120 }}>
      <View
        style={{
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: '#A69B8A',
          marginBottom: 32,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Image
            source={image}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 64,
              backgroundColor: '#A69B8A',
            }}
          />
        )}
      </View>

      <Text
        style={[FontStyles.heading1, { color: '#000000', textAlign: 'center', marginBottom: 16 }]}
      >
        {title}
      </Text>
      <Text style={[FontStyles.bodyLarge, { color: '#6B7280', textAlign: 'center' }]}>
        {subtitle}
      </Text>
    </View>
  )
);

const QuestionScreen = memo(
  ({
    title,
    subtitle,
    options,
    answers,
    onAnswer,
    questionKey,
    questionType,
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
      <Text
        style={[
          FontStyles.heading2,
          { color: '#000000', textAlign: 'center', marginBottom: 8, fontWeight: '600' },
        ]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            FontStyles.bodyMedium,
            { color: '#6B7280', textAlign: 'center', marginBottom: 16 },
          ]}
        >
          {subtitle}
        </Text>
      )}

      {questionType === 'multi-choice-question' && (
        <Text
          style={[
            FontStyles.bodySmall,
            { color: '#9CA3AF', textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
          ]}
        >
          Select all that apply
        </Text>
      )}

      {options && questionKey && (
        <ScrollView
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {options.map(option => {
            const isSelected =
              questionType === 'single-choice-question'
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
                  borderColor: isSelected ? '#A69B8A' : '#E5E7EB',
                }}
                onPress={() =>
                  questionKey && onAnswer(questionKey as AnswerKey, option, questionType || '')
                }
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    FontStyles.button,
                    {
                      textAlign: 'center',
                      fontWeight: '400',
                      color: isSelected ? '#A69B8A' : '#FFFFFF',
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  )
);

const ProgressBar = memo(({ progress }: { progress: Animated.Value }) => (
  <View style={{ flex: 1, marginHorizontal: 16 }}>
    <View
      style={{
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: '100%',
          borderRadius: 2,
          backgroundColor: '#A69B8A',
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
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
      justifyContent: 'center',
    }}
    activeOpacity={0.7}
  >
    <Text style={{ fontSize: 28, color: '#6B7280', fontFamily: Fonts.bold }}>‹</Text>
  </TouchableOpacity>
));

const TapToContinue = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Text
      style={[
        FontStyles.caption,
        {
          color: '#9CA3AF',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      ]}
    >
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
  const statusBarHeight =
    Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : StatusBar.currentHeight || 24;
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
          recommendation_style: answers.consultationType,
        },
      };

      await AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
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
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
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
          height: navigationBarHeight,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {currentIndex > 0 ? <BackButton onPress={handleBack} /> : <View style={{ width: 40 }} />}

          <ProgressBar progress={progressAnim} />

          <View style={{ width: 40 }} />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          paddingTop: statusBarHeight + navigationBarHeight,
          paddingBottom: 100,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
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
            backgroundColor: '#FFFFFF',
          }}
        >
          {currentScreen.type === 'info' ? (
            <TapToContinue onPress={handleNext} />
          ) : (
            <Gravity>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 24,
                  paddingVertical: 20,
                }}
              >
                <NextButton onPress={handleNext} />
              </View>
            </Gravity>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
