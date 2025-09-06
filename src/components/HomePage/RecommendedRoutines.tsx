import React, { memo, useRef, useCallback } from "react";
import { View, Text, ScrollView, Animated, Image, TouchableOpacity } from "react-native";
import { FontStyles } from '../../lib/fonts';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { recommendedData, RoutineCard } from "../../lib/constant";

const CARD_WIDTH = 230;
const CARD_HEIGHT = 160;
const SPACING = 16;
const FOCUSED_SCALE = 1;
const ADJACENT_SCALE = 0.95;

export const BaseRecommendedCard = memo(({
    data,
    onPress,
    style = {},
    showAnimation = true,
    index = 0,
    scrollX
}: {
    data: any,
    onPress?: (data: any) => void,
    style?: any,
    showAnimation?: boolean,
    index?: number,
    scrollX?: Animated.Value
}) => {
    const handleCardPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) {
            onPress(data);
        } else {
            router.push(`/routine/${data.slug}`);
        }
    }, [data, onPress]);

    const cardContent = (
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
                    backgroundColor: data.backgroundColor || '#A69B8A2A',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                    overflow: 'hidden',
                }}>
                    <Image
                        source={data.image ? data.image : { uri: data.image_url || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=Yoga' }}
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
                }]} numberOfLines={2}>
                    {data.title || data.name}
                </Text>

                <Text style={[FontStyles.bodyMedium, {
                    color: '#9CA3AF',
                    fontWeight: '700',
                    fontSize: 14,
                    textAlign: 'center',
                }]}>
                    {data.duration || `${data.total_duration_minutes} MINUTES`}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (!showAnimation || !scrollX) {
        return (
            <View style={[{
                paddingTop: 10,
                paddingBottom: 10,
                marginRight: 16,
            }, style]}>
                {cardContent}
            </View>
        );
    }

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

    return (
        <Animated.View style={[{
            transform: [{ scale }],
            opacity,
            paddingTop: 10,
            paddingBottom: 10,
            marginRight: index === recommendedData.length - 1 ? 0 : SPACING,
        }, style]}>
            {cardContent}
        </Animated.View>
    );
});

export const RecommendedCard = memo(({ data, index, scrollX }: {
    data: RoutineCard,
    index: number,
    scrollX: Animated.Value
}) => {
    return (
        <BaseRecommendedCard
            data={data}
            index={index}
            scrollX={scrollX}
            showAnimation={true}
        />
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
