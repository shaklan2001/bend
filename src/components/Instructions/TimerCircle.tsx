import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface TimerCircleProps {
  progress: number;
  size: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export const TimerCircle = memo(
  ({
    progress,
    size,
    strokeWidth = 8,
    backgroundColor = '#E5E7EB',
    progressColor = '#A69B8A',
  }: TimerCircleProps) => {
    const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
    const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
    const strokeDasharray = useMemo(() => circumference, [circumference]);
    const strokeDashoffset = useMemo(
      () => circumference - progress * circumference,
      [circumference, progress]
    );

    const center = useMemo(() => size / 2, [size]);

    const svgStyle = useMemo(
      () => ({
        transform: [{ rotate: '-90deg' }],
      }),
      []
    );

    return (
      <View className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center'>
        <Svg width={size} height={size} style={svgStyle}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill='transparent'
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill='transparent'
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
          />
        </Svg>
      </View>
    );
  }
);
