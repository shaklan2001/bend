import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontStyles } from '../lib/fonts';

const recommendedRoutines = [
  { id: 1, title: 'Pelvic Tilt', duration: '7 MINUTES', color: '#8B5CF6', icon: 'human-male' },
  { id: 2, title: 'Shoulders 1', duration: '5 MINUTES', color: '#10B981', icon: 'human-male' },
  { id: 3, title: 'Tech Neck', duration: '5 MINUTES', color: '#059669', icon: 'laptop' },
];

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const RecommendedCard = memo(({ routine }: { routine: (typeof recommendedRoutines)[0] }) => (
  <TouchableOpacity
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    }}
    activeOpacity={0.7}
  >
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${routine.color}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      }}
    >
      <MaterialCommunityIcons name={routine.icon as any} size={24} color={routine.color} />
    </View>

    <View className='flex-1'>
      <Text
        style={[
          FontStyles.bodyLarge,
          {
            color: '#000000',
            fontWeight: '700',
            marginBottom: 4,
          },
        ]}
      >
        {routine.title}
      </Text>
      <Text
        style={[
          FontStyles.bodyMedium,
          {
            color: '#9CA3AF',
            fontWeight: '600',
          },
        ]}
      >
        {routine.duration}
      </Text>
    </View>

    <MaterialCommunityIcons name='chevron-right' size={24} color='#D1D5DB' />
  </TouchableOpacity>
));

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchText('');
    onClose();
  }, []);

  const filteredRoutines = recommendedRoutines.filter(routine =>
    routine.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent={true} animationType='none' onRequestClose={handleClose}>
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
            transform: [{ translateY: slideAnim }],
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-100'>
              <Text style={[FontStyles.heading2, { color: '#000000', fontWeight: '700' }]}>
                Search
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name='close' size={20} color='#6B7280' />
              </TouchableOpacity>
            </View>

            <View className='px-6 py-4'>
              <View
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 34,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <MaterialCommunityIcons
                  name='magnify'
                  size={24}
                  color='#9CA3AF'
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder='Search for a routine'
                  placeholderTextColor='#9CA3AF'
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#374151',
                    fontWeight: '500',
                  }}
                  autoFocus={true}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchText('')}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#E5E7EB',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name='close' size={16} color='#6B7280' />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <ScrollView
              className='flex-1 px-6'
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
            >
              <Text
                style={[
                  FontStyles.bodyMedium,
                  {
                    color: '#6B7280',
                    fontWeight: '600',
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  },
                ]}
              >
                {searchText.length > 0 ? 'Search Results' : 'Recommended'}
              </Text>

              <View className='space-y-3 gap-2'>
                {(searchText.length > 0 ? filteredRoutines : recommendedRoutines).map(routine => (
                  <RecommendedCard key={routine.id} routine={routine} />
                ))}
              </View>

              {searchText.length > 0 && filteredRoutines.length === 0 && (
                <View className='py-8 items-center'>
                  <MaterialCommunityIcons name='magnify' size={48} color='#D1D5DB' />
                  <Text
                    style={[
                      FontStyles.bodyMedium,
                      {
                        color: '#9CA3AF',
                        marginTop: 16,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    No routines found for "{searchText}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SearchModal;
