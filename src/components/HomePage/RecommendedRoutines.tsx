import React, { memo, useRef, useCallback } from "react";
import { View, Text, ScrollView, Dimensions, Animated, Image, TouchableOpacity } from "react-native";
import { FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { recommendedData, RoutineCard } from "../../lib/constant";

const CARD_WIDTH = 230;
const CARD_HEIGHT = 160;
const SPACING = 16;
const FOCUSED_SCALE = 1;
const ADJACENT_SCALE = 0.95;

const RecommendedCard = memo(({ data, index, scrollX }: {
    data: RoutineCard,
    index: number,
    scrollX: Animated.Value
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
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp',
    });

    const handleCardPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/routine/${data.slug}`);
    }, [data.slug]);

    return (
        <Animated.View style={{
            transform: [{ scale }],
            opacity,
            paddingTop: 10,
            paddingBottom: 10,
            marginRight: index === recommendedData.length - 1 ? 0 : SPACING,
        }}>
            <TouchableOpacity
                onPress={handleCardPress}
                activeOpacity={0.8}
            >
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    padding: 20,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: data.backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                        overflow: 'hidden',
                    }}>
                        <Image
                            source={data.image}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            }}
                            resizeMode="cover"
                        />
                    </View>

                    <Text style={[FontStyles.bodyLarge, {
                        color: '#000000',
                        fontWeight: '700',
                        fontSize: 20,
                        textAlign: 'center'
                    }]}>
                        {data.title}
                    </Text>

                    <Text style={[FontStyles.bodyMedium, {
                        color: '#9CA3AF',
                        fontWeight: '700',
                        fontSize: 14,
                        textAlign: 'center',
                    }]}>
                        {data.duration}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

const RecommendedRoutines = () => {
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


    return (
        <View style={{ paddingVertical: 10 }}>
            <View className="px-6 mb-4">
                <Text style={[FontStyles.bodyMedium, {
                    color: '#A69B8A',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: 16,
                }]}>
                    RECOMMENDED
                </Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="start"
                decelerationRate='normal'
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingLeft: SPACING,
                    paddingRight: SPACING,
                }}
            >
                {recommendedData.map((item, index) => (
                    <RecommendedCard
                        key={index}
                        data={item}
                        index={index}
                        scrollX={scrollX}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default RecommendedRoutines;
