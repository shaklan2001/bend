import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { FontStyles } from '../../../lib/fonts';
import * as Haptics from 'expo-haptics';
import CustomModal from '@src/components/CustomeRoute/CustomModal';
import CoverPreviewCard from '@src/components/Shared/CoverPreviewCard';
import { getCustomRoutines, CustomRoutine, clearAllCustomRoutines } from '../../../lib/customRoutines';

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
      className="mx-8 px-4 py-4 items-center mt-8"
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

const SavedRoutineCard = memo(({ routine }: { routine: CustomRoutine }) => {
  const router = useRouter();
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/routine/${routine.slug}`);
  }, [routine.slug, router]);

  return (
    <CoverPreviewCard
      exercises={routine.exercises}
      routineName={routine.name}
      showTouchable={true}
      onPress={handlePress}
    />
  );
});

const MyRoutinesSection = memo(({ routines }: { routines: CustomRoutine[] }) => {
  if (routines.length === 0) return null;

  return (
    <View className="mt-8">
      <Text style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        MY ROUTINES
      </Text>

      {routines.map((routine) => (
        <SavedRoutineCard key={routine.id} routine={routine} />
      ))}
    </View>
  );
});

const CustomRoutineScreen = () => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>([]);

  const handleCreateRoutine = useCallback(() => {
    setIsBottomSheetVisible(true);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetVisible(false);
  }, []);

  const loadCustomRoutines = useCallback(async () => {
    try {
      const routines = await getCustomRoutines();
      setCustomRoutines(routines);
    } catch (error) {
      console.error('Error loading custom routines:', error);
    }
  }, []);

  const handleClearAllRoutines = useCallback(async () => {
    try {
      const success = await clearAllCustomRoutines();
      if (success) {
        setCustomRoutines([]);
        console.log('All custom routines cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing custom routines:', error);
    }
  }, []);

  useEffect(() => {
    loadCustomRoutines();
  }, [loadCustomRoutines]);

  useEffect(() => {
    if (!isBottomSheetVisible) {
      loadCustomRoutines();
    }
  }, [isBottomSheetVisible, loadCustomRoutines]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Header />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <CreateRoutineCard onPress={handleCreateRoutine} />

        {customRoutines.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAllRoutines}
            style={{
              marginHorizontal: 32,
              marginTop: 16,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: '#EF4444',
              borderRadius: 8,
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: 14,
            }}>
              🗑️ Clear All Custom Routines (Testing)
            </Text>
          </TouchableOpacity>
        )}

        <MyRoutinesSection routines={customRoutines} />
      </ScrollView>

      {isBottomSheetVisible && <CustomModal
        visible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      />}
    </SafeAreaView>
  );
};

export default CustomRoutineScreen;