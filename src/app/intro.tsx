import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import { FontStyles } from '../lib/fonts';
import { checkOnboardingStatus } from '../lib/supabase';
import LogInSheet from '../components/Shared/LogInSheet';

const CircleStep = memo(({ circleScale }: { circleScale: Animated.Value }) => (
  <View className='flex-1 justify-center items-center'>
    <Animated.View
      style={{
        transform: [{ scale: circleScale }],
        backgroundColor: '#A69B8A',
      }}
      className='w-32 h-32 rounded-full mr-8'
    />
  </View>
));

const LogoStep = memo(
  ({
    circleScale,
    circleMoveX,
    textSlideX,
    textOpacity,
  }: {
    circleScale: Animated.Value;
    circleMoveX: Animated.Value;
    textSlideX: Animated.Value;
    textOpacity: Animated.Value;
  }) => (
    <View className='flex-1 justify-center items-center'>
      <View className='items-center'>
        <View className='flex-row items-center'>
          <Animated.View
            style={{
              transform: [{ scale: circleScale }, { translateX: circleMoveX }],
              backgroundColor: '#A69B8A',
            }}
            className='w-32 h-32 rounded-full mr-1'
          />
          <Animated.View
            style={{
              transform: [{ translateX: textSlideX }],
              opacity: textOpacity,
            }}
          >
            <Text style={[FontStyles.logo, { color: '#000000' }]}>bend</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  )
);

const ReferralCodeModal = memo(
  ({
    visible,
    onClose,
    referralCode,
    setReferralCode,
    onLogin,
  }: {
    visible: boolean;
    onClose: () => void;
    referralCode: string;
    setReferralCode: (code: string) => void;
    onLogin: () => void;
  }) => (
    <Modal visible={visible} transparent animationType='none' onRequestClose={onClose}>
      <View className='flex-1 bg-white'>
        <SafeAreaView style={{ flex: 1 }}>
          <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-100'>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 24, color: '#6B7280' }}>✕</Text>
            </TouchableOpacity>

            <Text
              style={[
                FontStyles.heading2,
                {
                  color: '#000000',
                  fontWeight: '700',
                  flex: 1,
                  textAlign: 'center',
                },
              ]}
            >
              Enter Referral Code
            </Text>

            <View style={{ width: 40 }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className='flex-1 px-6 py-6'>
              <Text
                style={[
                  FontStyles.bodyMedium,
                  {
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: 40,
                    lineHeight: 22,
                  },
                ]}
              >
                Enter your referral code to get started.
              </Text>

              <View className='mb-16'>
                <TextInput
                  value={referralCode}
                  onChangeText={setReferralCode}
                  className='w-full px-4 py-4 border-2 border-gray-300 rounded-2xl text-center text-lg bg-white'
                  placeholder='Referral Code'
                  placeholderTextColor='#9CA3AF'
                  autoFocus
                  style={{
                    borderColor: '#E5E7EB',
                    fontSize: 16,
                    color: '#000000',
                  }}
                />
              </View>

              <Button
                title='Apply Code'
                onPress={onClose}
                className='py-4 px-8 rounded-full w-full mb-16'
                style={{ backgroundColor: '#A69B8A' }}
                textClassName='text-white text-lg font-semibold tracking-wider'
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  )
);

export default function IntroScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const circleScale = useRef(new Animated.Value(0)).current;
  const circleMoveX = useRef(new Animated.Value(0)).current;
  const textSlideX = useRef(new Animated.Value(300)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const finalScreenOpacity = useRef(new Animated.Value(0)).current;

  const checkOnboardingStatusLocal = useCallback(async () => {
    try {
      const { completed } = await checkOnboardingStatus();
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
    }
  }, []);

  useEffect(() => {
    checkOnboardingStatusLocal();
  }, []);

  const handleGetStarted = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(onboarding)');
  }, []);

  const handleLogin = useCallback(() => {
    setShowLoginSheet(true);
  }, []);

  const handleReferralCodePress = useCallback(() => {
    setShowReferralModal(true);
  }, []);

  const closeReferralModal = useCallback(() => {
    setShowReferralModal(false);
  }, []);

  const handleLoginFromReferral = useCallback(() => {
    setShowReferralModal(false);
    setShowLoginSheet(true);
  }, []);

  const closeLoginSheet = useCallback(() => {
    setShowLoginSheet(false);
  }, []);

  const handleSwitchToCreateAccount = useCallback(() => {
    console.log('Switch to create account');
  }, []);

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
        }),
      ]).start(() => {
        setCurrentStep(2);

        if (!onboardingCompleted) {
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
          setTimeout(() => {
            router.push('/(tabs)');
          }, 1000);
        }
      });
    }, 1500);
  }, [onboardingCompleted]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
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
        <View className='flex-1'>
          <View className='absolute inset-0 justify-center items-center'>
            <View className='items-center'>
              <View className='flex-row items-center'>
                <Animated.View
                  style={{
                    transform: [{ scale: circleScale }, { translateX: circleMoveX }],
                    backgroundColor: '#A69B8A',
                  }}
                  className='w-32 h-32 rounded-full mr-1'
                />
                <Text style={[FontStyles.logo, { color: '#000000' }]}>bend</Text>
              </View>
            </View>
          </View>

          {!onboardingCompleted && (
            <Animated.View
              style={{ opacity: finalScreenOpacity }}
              className='absolute bottom-0 left-0 right-0 px-8 pb-8'
            >
              <TouchableOpacity
                onPress={handleReferralCodePress}
                className='w-full mb-4'
                activeOpacity={0.7}
              >
                <Text style={[FontStyles.bodyMedium, { color: '#9CA3AF', textAlign: 'center' }]}>
                  Enter Referral Code
                </Text>
              </TouchableOpacity>

              <View className='w-full'>
                <Button
                  title='GET STARTED'
                  onPress={handleGetStarted}
                  className='py-4 px-8 rounded-full w-full mb-2'
                  style={{ backgroundColor: '#A69B8A' }}
                  textClassName='text-white text-lg font-semibold tracking-wider'
                />

                <Button
                  title='LOG IN'
                  onPress={handleLogin}
                  variant='outline'
                  className='border-2 py-4 px-8 rounded-full w-full bg-transparent'
                  style={{ borderColor: '#E5E7EB' }}
                  textClassName='text-gray-600 text-lg font-semibold tracking-wider'
                />
              </View>

              <View className='mt-1 px-4'>
                <Text style={[FontStyles.bodyXSmall, { color: '#9CA3AF', textAlign: 'center' }]}>
                  By continuing, you agree to our Privacy Policy{'\n'}and Terms of Use.
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      )}

      {showReferralModal && (
        <ReferralCodeModal
          visible={showReferralModal}
          onClose={closeReferralModal}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          onLogin={handleLoginFromReferral}
        />
      )}

      {showLoginSheet && (
        <LogInSheet
          visible={showLoginSheet}
          onClose={closeLoginSheet}
          onSwitchToCreateAccount={handleSwitchToCreateAccount}
        />
      )}
    </SafeAreaView>
  );
}
