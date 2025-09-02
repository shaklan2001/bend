import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontStyles } from '../../../lib/fonts';
import * as Haptics from 'expo-haptics';
import CustomModal from '@src/components/CustomeRoute/CustomModal';
import { getCustomRoutines, CustomRoutine } from '../../../lib/customRoutines';

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
  const totalMinutes = Math.floor(routine.totalDuration / 60);

  return (
    <TouchableOpacity
      className="mx-8 px-4 py-4 mb-4"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}
      activeOpacity={0.8}
    >
      {/* Exercise Icons Row */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
      }}>
        {routine.exercises.slice(0, 5).map((exercise, index) => (
          <View key={exercise.id} style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: index === 0 ? '#FCE7F3' :
              index === 1 ? '#A69B8A' :
                index === 2 ? '#FEF3C7' : '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            <Image
              source={{ uri: exercise.image_url }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              resizeMode="cover"
            />
          </View>
        ))}
        {/* Add placeholder circles if less than 5 exercises */}
        {Array.from({ length: Math.max(0, 5 - routine.exercises.length) }).map((_, index) => (
          <View key={`placeholder-${index}`} style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
            borderWidth: 2,
            borderColor: '#E5E7EB',
            borderStyle: 'dashed',
          }} />
        ))}
      </View>

      {/* Routine Name */}
      <Text style={{
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        {routine.name}
      </Text>

      {/* Duration */}
      <Text style={{
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '500',
        textTransform: 'uppercase',
      }}>
        {totalMinutes} MINUTES
      </Text>
    </TouchableOpacity>
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