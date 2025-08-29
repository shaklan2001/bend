import React, { memo, useRef, useCallback } from "react";
import { View, Text, ScrollView, Dimensions, Animated } from "react-native";
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const SPACING = 20;
const FOCUSED_SCALE = 1;
const ADJACENT_SCALE = 0.6;

const yogaData = [
    { time: "15 mins", title: "Full Body" },
    { time: "5 mins", title: "Wake Up" },
    { time: "4 mins", title: "Posture Reset" },
    { time: "10 mins", title: "Stretch" },
    { time: "20 mins", title: "Strength" },
];

const YogaCarouselCard = memo(({ data, index, scrollX, isFocused }: {
    data: { time: string; title: string },
    index: number,
    scrollX: Animated.Value,
    isFocused: boolean
}) => {
    const cardPosition = index * (CARD_WIDTH + SPACING);
    
    const inputRange = [
        cardPosition - (CARD_WIDTH + SPACING),
        cardPosition,
        cardPosition + (CARD_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [ADJACENT_SCALE, FOCUSED_SCALE, ADJACENT_SCALE],
        extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={{
            transform: [{ scale }],
            opacity,
            marginTop: 20,
            marginBottom: 20,
            marginRight: index === yogaData.length - 1 ? 0 : SPACING,
        }}>
            <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 45,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 10.84,
                elevation: 8,
                padding: 24,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
            }}>
                <Text style={{
                    color: '#A69B8A',
                    fontSize: 16,
                    fontWeight: '700',
                    marginBottom: 4,
                }}>{data.time}</Text>
                <Text style={{
                    color: '#000000',
                    fontSize: 26,
                    fontWeight: '700',
                    marginBottom: 12,
                }}>{data.title}</Text>
            </View>
        </Animated.View>
    );
});

const YogaCarousel = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const hapticTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = useCallback((event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        scrollX.setValue(offsetX);
    }, []);

    const handleScrollEnd = useCallback(() => {
        if (hapticTimeout.current) {
            clearTimeout(hapticTimeout.current);
        }

        hapticTimeout.current = setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 0);
    }, []);

    const sideOffset = (screenWidth - CARD_WIDTH) / 2;

    return (
        <View style={{ height: CARD_HEIGHT + 40 }}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="start"
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingLeft: sideOffset,
                    paddingRight: sideOffset,
                }}
            >
                {yogaData.map((item, index) => (
                    <YogaCarouselCard
                        key={index}
                        data={item}
                        index={index}
                        scrollX={scrollX}
                        isFocused={false}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default YogaCarousel;