import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, FontStyles } from '../../lib/fonts';
import Button from '../Button';
import { MemoizedInput } from './CreateAccountSheet';
import { useAppDispatch, useAuthLoading } from '../../store/hooks';
import { clearError, resetPassword, signInUser } from '../../store/slices/authSlice';

interface LogInSheetProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToCreateAccount?: () => void;
  onSuccess?: () => void;
}

const LogInSheet: React.FC<LogInSheetProps> = ({
  visible,
  onClose,
  onSwitchToCreateAccount,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const isLoading = useAuthLoading();

  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-1000);
      fadeAnim.setValue(0);
      contentSlideAnim.setValue(50);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 0,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -1000,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLogIn = useCallback(async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearError());

      const result = await dispatch(
        signInUser({
          email: email.trim(),
          password,
        })
      );

      if (signInUser.fulfilled.match(result)) {
        // Clear form
        setEmail('');
        setPassword('');

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else if (signInUser.rejected.match(result)) {
        Alert.alert('Sign In Failed', result.payload?.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  }, [email, password, dispatch, onSuccess, onClose]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert(
        'Reset Password',
        'Please enter your email address first, then tap "Forgot your password?" again.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert('Reset Password', `Send password reset email to ${email.trim()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: async () => {
          try {
            const result = await dispatch(resetPassword(email.trim()));

            if (resetPassword.fulfilled.match(result)) {
              Alert.alert(
                'Email Sent',
                'Please check your email for password reset instructions.',
                [{ text: 'OK' }]
              );
            } else if (resetPassword.rejected.match(result)) {
              Alert.alert('Error', result.payload?.message || 'Failed to send reset email');
            }
          } catch (error) {
            console.error('Reset password error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
          }
        },
      },
    ]);
  }, [email, dispatch]);

  return (
    <Modal visible={visible} transparent={true} animationType='none' onRequestClose={onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX: slideAnim }],
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-100'>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: 8,
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name='arrow-left' size={24} color='#6B7280' />
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
                Log In
              </Text>

              <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView
                className='flex-1 px-6 py-6'
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
              >
                <Animated.View
                  style={{
                    transform: [{ translateY: contentSlideAnim }],
                    opacity: contentSlideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [1, 0],
                    }),
                  }}
                >
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
                    Log in to your existing account.
                  </Text>

                  <View className='space-y-6 mb-16 gap-2'>
                    <MemoizedInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder='Email address'
                      placeholderTextColor='#9CA3AF'
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />

                    <MemoizedInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder='Password'
                      placeholderTextColor='#9CA3AF'
                      secureTextEntry
                    />
                  </View>

                  <Button
                    title={isLoading ? 'Signing In...' : 'Log In'}
                    onPress={handleLogIn}
                    className='py-4 px-8 rounded-full w-full mb-2'
                    style={{
                      backgroundColor: isLoading ? '#9CA3AF' : '#A69B8A',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    textClassName='text-white text-lg font-semibold tracking-wider'
                    disabled={isLoading}
                  />

                  <View className='items-center'>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text
                        style={[
                          FontStyles.bodyMedium,
                          {
                            color: '#9CA3AF',
                            textDecorationLine: 'underline',
                            fontWeight: '600',
                          },
                        ]}
                      >
                        Forgot your password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default memo(LogInSheet);
