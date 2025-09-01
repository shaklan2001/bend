import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontStyles } from '../../../lib/fonts';
import * as Haptics from 'expo-haptics';

const TriangularPatternIcon = memo(() => (
  <View className="items-center mb-6">
    <View
      className="w-8 h-8 rounded-full mb-3"
      style={{ backgroundColor: '#A69B8A3A' }}
    />

    <View className="flex-row space-x-6 gap-4">
      <View
        className="w-8 h-8 rounded-full"
        style={{ backgroundColor: '#A69B8A3A' }}
      />
      <View
        className="w-8 h-8 rounded-full"
        style={{ backgroundColor: '#A69B8A3A' }}
      />
    </View>
  </View>
));

const CreateRoutineCard = memo(({ onPress }: { onPress: () => void }) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mx-8 px-4 py-8 items-center mt-8"
      style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}
      activeOpacity={0.8}
    >
      <TriangularPatternIcon />

      <Text style={[FontStyles.heading2, {
        color: '#374151',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
      }]}>
        Create Your Own Routine
      </Text>

      <Text style={[FontStyles.bodyMedium, {
        color: '#6B7280',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.7,
      }]}>
        TAP TO START
      </Text>
    </TouchableOpacity>
  );
});

const Header = memo(() => (
  <View className="flex-row items-center justify-center px-6 py-4 border-b border-gray-100">
    <Text style={[FontStyles.heading1, {
      color: '#000000',
      fontWeight: '700',
    }]}>
      Custom
    </Text>
  </View>
));

const CustomRoutine = () => {
  const handleCreateRoutine = useCallback(() => {
    console.log('Create routine tapped');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Header />
      <View className="flex-1">
        <CreateRoutineCard onPress={handleCreateRoutine} />
      </View>
    </SafeAreaView>
  );
};

export default CustomRoutine;