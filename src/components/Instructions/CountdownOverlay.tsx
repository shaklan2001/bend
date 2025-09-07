import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { FontStyles } from '../../lib/fonts';

interface CountdownOverlayProps {
  value: number | string;
}

export const CountdownOverlay = memo(({ value }: CountdownOverlayProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    return () => clearTimeout(timer);
  }, [value, scaleAnim, opacityAnim]);

  return (
    <View
      className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center z-50'
      style={countdownOverlayStyles.fullScreenOverlay}
    >
      <Animated.View
        className='items-center justify-center'
        style={[
          countdownOverlayStyles.circleOverlay,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text
          className='text-center text-white'
          style={
            typeof value === 'string'
              ? countdownOverlayStyles.startText
              : countdownOverlayStyles.countdownText
          }
        >
          {value}
        </Text>
      </Animated.View>
    </View>
  );
});

const countdownOverlayStyles = StyleSheet.create({
  fullScreenOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  circleOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    ...FontStyles.heading1,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    fontSize: 140,
    textAlign: 'center' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    lineHeight: 140,
  },
  startText: {
    ...FontStyles.heading1,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    fontSize: 80,
    textAlign: 'center' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    lineHeight: 140,
  },
});
