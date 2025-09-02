import React, { memo, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontStyles } from '../../../lib/fonts';
import ActionButton from '../../../components/ActionButton';
import CreateAccountSheet from '../../../components/Shared/CreateAccountSheet';
import LogInSheet from '../../../components/Shared/LogInSheet';
import * as Haptics from 'expo-haptics';
import Header from '@src/components/UI/Header';

const ProfileFooter = memo(() => {
  return (
    <View className="px-6 py-8">
      <View className="items-center space-y-2">
        <Text style={[FontStyles.bodySmall, {
          color: '#9CA3AF',
          textAlign: 'center',
          fontWeight: '800',
        }]}>
          Version 0.0.1
        </Text>

        <Text style={[FontStyles.bodySmall, {
          color: '#9CA3AF',
          textAlign: 'center',
          fontWeight: '500',
        }]}>
          Made in India
        </Text>

        <Text style={[FontStyles.bodySmall, {
          color: '#9CA3AF',
          textAlign: 'center',
          fontWeight: '500',
        }]}>
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

  const handleClose = () => {
    router.back();
  };

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCreateAccount(true);
  };

  const handleLogIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLogIn(true);
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    // Add your navigation logic here
  };

  const handleReferralCode = () => {
    console.log('Referral Code pressed');
    // Add your navigation logic here
  };

  const handleContactSupport = () => {
    console.log('Contact Support pressed');
    // Add your navigation logic here
  };

  const handleTermsOfUse = () => {
    console.log('Terms of Use pressed');
    // Add your navigation logic here
  };

  const handlePrivacyPolicy = () => {
    console.log('Privacy Policy pressed');
    // Add your navigation logic here
  };

  const closeCreateAccount = () => {
    setShowCreateAccount(false);
  };

  const closeLogIn = () => {
    setShowLogIn(false);
  };

  const switchToLogIn = () => {
    setShowCreateAccount(false);
    setShowLogIn(true);
  };

  const switchToCreateAccount = () => {
    setShowLogIn(false);
    setShowCreateAccount(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Header title="Profile" onClose={handleClose} />
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text style={[FontStyles.bodyMedium, {
            color: '#6B7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: 14,
            marginBottom: 16,
          }]}>
            ACCOUNT
          </Text>

          <ActionButton
            title="Create Account"
            onPress={handleCreateAccount}
            showNewTag={true}
          />

          <ActionButton
            title="Log In"
            onPress={handleLogIn}
          />
        </View>

        <View className="mb-8">
          <Text style={[FontStyles.bodyMedium, {
            color: '#6B7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: 14,
            marginBottom: 16,
          }]}>
            SETTINGS
          </Text>

          <ActionButton
            title="Notifications"
            onPress={handleNotifications}
          />
        </View>

        <View className="mb-8">
          <Text style={[FontStyles.bodyMedium, {
            color: '#6B7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: 14,
            marginBottom: 16,
          }]}>
            SUPPORT
          </Text>

          <ActionButton
            title="Referral Code"
            onPress={handleReferralCode}
          />

          <ActionButton
            title="Contact Support"
            onPress={handleContactSupport}
          />

          <ActionButton
            title="Terms of Use"
            onPress={handleTermsOfUse}
          />

          <ActionButton
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
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