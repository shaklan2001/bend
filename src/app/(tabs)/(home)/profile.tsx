import React, { memo, useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontStyles } from '../../../lib/fonts';
import ActionButton from '../../../components/ActionButton';
import CreateAccountSheet from '../../../components/Shared/CreateAccountSheet';
import LogInSheet from '../../../components/Shared/LogInSheet';
import * as Haptics from 'expo-haptics';
import Header from '@src/components/UI/Header';
import { useAppDispatch, useAuth } from '../../../store/hooks';
import { signOutUser } from '../../../store/slices/authSlice';

const ProfileFooter = memo(() => {
  return (
    <View className='px-6 py-8'>
      <View className='items-center space-y-2'>
        <Text
          style={[
            FontStyles.bodySmall,
            {
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '800',
            },
          ]}
        >
          Version 0.0.1
        </Text>

        <Text
          style={[
            FontStyles.bodySmall,
            {
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '500',
            },
          ]}
        >
          Made in India
        </Text>

        <Text
          style={[
            FontStyles.bodySmall,
            {
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '500',
            },
          ]}
        >
          © 2025 Bend Health & Fitness, Inc.
        </Text>
      </View>
    </View>
  );
});

const ProfileScreen = () => {
  const router = useRouter();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleCreateAccount = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCreateAccount(true);
  }, []);

  const handleLogIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLogIn(true);
  }, []);

  const handleNotifications = useCallback(() => {
    console.log('Notifications pressed');
  }, []);

  const handleReferralCode = useCallback(() => {
    console.log('Referral Code pressed');
  }, []);

  const handleContactSupport = useCallback(() => {
    console.log('Contact Support pressed');
  }, []);

  const handleTermsOfUse = useCallback(() => {
    console.log('Terms of Use pressed');
  }, []);

  const handlePrivacyPolicy = useCallback(() => {
    console.log('Privacy Policy pressed');
  }, []);

  const closeCreateAccount = useCallback(() => {
    setShowCreateAccount(false);
  }, []);

  const closeLogIn = useCallback(() => {
    setShowLogIn(false);
  }, []);

  const switchToLogIn = useCallback(() => {
    setShowCreateAccount(false);
    setShowLogIn(true);
  }, []);

  const switchToCreateAccount = useCallback(() => {
    setShowLogIn(false);
    setShowCreateAccount(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            const result = await dispatch(signOutUser());
            if (signOutUser.fulfilled.match(result)) {
              // Optionally show success message or navigate somewhere
              console.log('Signed out successfully');
            } else if (signOutUser.rejected.match(result)) {
              Alert.alert('Error', result.payload?.message || 'Failed to sign out');
            }
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
          }
        },
      },
    ]);
  }, [dispatch]);

  const handleAuthSuccess = useCallback(() => {
    setShowCreateAccount(false);
    setShowLogIn(false);
    // Optionally show welcome message or refresh the screen
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <Header title='Profile' onClose={handleClose} />
      <ScrollView className='flex-1 px-6 py-6' showsVerticalScrollIndicator={false}>
        <View className='mb-8'>
          <Text
            style={[
              FontStyles.bodyMedium,
              {
                color: '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: 14,
                marginBottom: 16,
              },
            ]}
          >
            ACCOUNT
          </Text>

          {isAuthenticated ? (
            <>
              <View
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text
                  style={[
                    FontStyles.bodyMedium,
                    {
                      color: '#111827',
                      fontWeight: '600',
                      marginBottom: 4,
                    },
                  ]}
                >
                  Welcome back!
                </Text>
                <Text
                  style={[
                    FontStyles.bodySmall,
                    {
                      color: '#6B7280',
                      marginBottom: 8,
                    },
                  ]}
                >
                  {user?.full_name && `${user.full_name} • `}
                  {user?.email}
                </Text>
              </View>

              <ActionButton title='Sign Out' onPress={handleSignOut} />
            </>
          ) : (
            <>
              <ActionButton
                title='Create Account'
                onPress={handleCreateAccount}
                showNewTag={true}
              />

              <ActionButton title='Log In' onPress={handleLogIn} />
            </>
          )}
        </View>

        <View className='mb-8'>
          <Text
            style={[
              FontStyles.bodyMedium,
              {
                color: '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: 14,
                marginBottom: 16,
              },
            ]}
          >
            SETTINGS
          </Text>

          <ActionButton title='Notifications' onPress={handleNotifications} />
        </View>

        <View className='mb-8'>
          <Text
            style={[
              FontStyles.bodyMedium,
              {
                color: '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: 14,
                marginBottom: 16,
              },
            ]}
          >
            SUPPORT
          </Text>

          <ActionButton title='Referral Code' onPress={handleReferralCode} />

          <ActionButton title='Contact Support' onPress={handleContactSupport} />

          <ActionButton title='Terms of Use' onPress={handleTermsOfUse} />

          <ActionButton title='Privacy Policy' onPress={handlePrivacyPolicy} />
        </View>

        <ProfileFooter />
      </ScrollView>

      <CreateAccountSheet
        visible={showCreateAccount}
        onClose={closeCreateAccount}
        onSwitchToLogIn={switchToLogIn}
      />

      <LogInSheet
        visible={showLogIn}
        onClose={closeLogIn}
        onSwitchToCreateAccount={switchToCreateAccount}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
