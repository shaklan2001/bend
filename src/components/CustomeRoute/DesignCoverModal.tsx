import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { NextButton } from '@src/components/Shared/NextButton';
import CoverPreviewCard from '@src/components/Shared/CoverPreviewCard';
import Header from '../UI/Header';

const { height: screenHeight } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  video_url?: string;
}

interface ExerciseWithDuration extends Exercise {
  duration_seconds: number;
  sequence: number;
}

interface DesignCoverModalProps {
  visible: boolean;
  onClose: () => void;
  exercises: ExerciseWithDuration[];
  onFinish: (routineData: {
    name: string;
    exercises: ExerciseWithDuration[];
    coverImage: string;
  }) => void;
}

const PhotoSelector = memo(
  ({
    exercises,
    selectedImages,
    onSelectImage,
  }: {
    exercises: ExerciseWithDuration[];
    selectedImages: string[];
    onSelectImage: (imageUrl: string) => void;
  }) => {
    const coverOptions = exercises.slice(0, 4).map(exercise => exercise.image_url);

    return (
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#6B7280',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          SELECT PHOTOS
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          {coverOptions.map((imageUrl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectImage(imageUrl)}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor:
                  index === 0
                    ? '#FCE7F3'
                    : index === 1
                      ? '#A69B8A'
                      : index === 2
                        ? '#FEF3C7'
                        : '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
                resizeMode='cover'
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);

const DesignCoverModal = memo(
  ({ visible, onClose, exercises, onFinish }: DesignCoverModalProps) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>(['', '', '']);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userHasInteracted, setUserHasInteracted] = useState(false);

    useEffect(() => {
      if (exercises.length > 0 && !isInitialized) {
        const defaultImages = exercises.slice(0, 3).map(ex => ex.image_url);
        setSelectedImages([defaultImages[0] || '', defaultImages[1] || '', defaultImages[2] || '']);
        setIsInitialized(true);
      }
    }, [exercises, isInitialized]);

    const handleSelectImage = useCallback(
      (imageUrl: string) => {
        setSelectedImages(prev => {
          if (!userHasInteracted) {
            setUserHasInteracted(true);
            return [imageUrl, '', ''];
          }

          const currentPosition = prev.findIndex(img => img === imageUrl);

          if (currentPosition === -1) {
            if (!prev[0]) {
              return [imageUrl, prev[1], prev[2]];
            } else if (!prev[1]) {
              return [prev[0], imageUrl, prev[2]];
            } else if (!prev[2]) {
              return [prev[0], prev[1], imageUrl];
            } else {
              return [imageUrl, prev[1], prev[2]];
            }
          } else {
            if (currentPosition === 0) {
              return ['', prev[1], imageUrl];
            } else if (currentPosition === 2) {
              return [prev[0], imageUrl, ''];
            } else {
              return [imageUrl, '', prev[2]];
            }
          }
        });
      },
      [userHasInteracted]
    );

    const handleFinish = useCallback(() => {
      if (!routineName.trim()) {
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      onFinish({
        name: routineName.trim(),
        exercises,
        coverImage: selectedImages[0] || exercises[0]?.image_url || '',
      });

      onClose();
    }, [routineName, exercises, selectedImages, onFinish, onClose]);

    const handleClose = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsClosing(true);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsClosing(false);
        setIsInitialized(false);
        setUserHasInteracted(false);
        onClose();
      });
    }, [onClose, slideAnim, fadeAnim]);

    useEffect(() => {
      if (visible && !isClosing) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [visible, isClosing, slideAnim, fadeAnim]);

    if (!visible) return null;

    return (
      <Modal visible={visible} transparent={true} animationType='none' onRequestClose={handleClose}>
        <StatusBar style='dark' />

        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              height: screenHeight,
              transform: [{ translateY: slideAnim }],
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <Header title='Design Cover' onClose={handleClose} />

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingTop: 24,
                  paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
              >
                <CoverPreviewCard
                  exercises={exercises.map((ex, index) => ({
                    ...ex,
                    image_url: selectedImages[index] || ex.image_url,
                  }))}
                  routineName={routineName}
                />
                <View style={{ marginBottom: 32 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: '#6B7280',
                      marginBottom: 16,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    CHOOSE NAME
                  </Text>

                  <TextInput
                    value={routineName}
                    onChangeText={setRoutineName}
                    placeholder='e.g. Morning Ritual'
                    placeholderTextColor='#9CA3AF'
                    style={{
                      borderWidth: 3,
                      borderColor: '#E5E7EB',
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      fontSize: 16,
                      color: '#111827',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </View>
                <PhotoSelector
                  exercises={exercises}
                  selectedImages={selectedImages}
                  onSelectImage={handleSelectImage}
                />
              </ScrollView>
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
                <NextButton onPress={handleFinish} />
              </View>
            </SafeAreaView>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);

export default DesignCoverModal;
