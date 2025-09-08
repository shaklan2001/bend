import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const SPACING = 20;
const FOCUSED_SCALE = 1;
const ADJACENT_SCALE = 0.6;

const yogaData = [
  { time: '8 mins', title: 'Lower Back', slug: 'lower-back-1' },
  { time: '4 mins', title: 'Wake Up', slug: 'wake-up' },
  { time: '5 mins', title: 'Morning Mobility', slug: 'morning-mobility' },
  { time: '7 mins', title: 'Hamstrings', slug: 'hamstrings-2' },
  { time: '5 mins', title: 'Shoulders', slug: 'shoulders-1' },
];

const YogaCarouselCard = memo(
  ({
    data,
    index,
    scrollX,
    isFocused: _isFocused,
  }: {
    data: { time: string; title: string; slug: string };
    index: number;
    scrollX: Animated.Value;
    isFocused: boolean;
  }) => {
    const router = useRouter();
    const cardPosition = index * (CARD_WIDTH + SPACING);

    const handlePress = useCallback(() => {
      router.push(`/routine/${data.slug}`);
    }, [router, data.slug]);

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
      <TouchableOpacity onPress={handlePress}>
        <Animated.View
          style={{
            transform: [{ scale }],
            opacity,
            marginTop: 20,
            marginBottom: 20,
            marginRight: index === yogaData.length - 1 ? 0 : SPACING,
          }}
        >
          <View
            style={{
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
            }}
          >
            <View className='flex-row justify-between items-center overflow-hidden'>
              <View className='flex-col'>
                <Text
                  style={{
                    color: '#A69B8A',
                    fontSize: 16,
                    fontWeight: '700',
                    marginBottom: 4,
                  }}
                >
                  {data.time}
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 26,
                    fontWeight: '700',
                    marginBottom: 12,
                  }}
                >
                  {data.title}
                </Text>
              </View>
              <View className='flex-row items-center gap-2 '>
                <View className='w-4 h-4 bg-[#A69B8A1A] rounded-full p-1' />
                <View className='w-8 h-8 bg-[#A69B8A1A] rounded-full p-1' />
                <View className='w-12 h-12 bg-[#A69B8A1A] rounded-full p-1' />
              </View>
            </View>
            <View className='flex-row items-center gap-2'>
              <View className='w-12 h-12 bg-[#A69B8A1A] rounded-full'>
                <Image
                  source={require('../../../assets/yoga/images_1.png')}
                  resizeMode='contain'
                  className='w-full h-full rounded-full'
                />
              </View>

              <View className='w-8 h-8 bg-[#A69B8A1A] rounded-full p-1' />
              <View className='w-20 h-20 bg-[#A69B8A1A] rounded-full'>
                <Image
                  source={require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (1).png')}
                  resizeMode='contain'
                  className='w-full h-full rounded-full'
                />
              </View>

              <View className='w-14 h-14 bg-[#A69B8A1A] rounded-full p-1' />
              <View className='w-8 h-8 bg-[#A69B8A1A] rounded-full p-1' />
            </View>
            <View className='flex-row items-center gap-2'>
              <View className='w-20 h-20 bg-[#A69B8A1A] rounded-full p-1'>
                <Image
                  source={require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc.png')}
                  resizeMode='contain'
                  className='w-full h-full rounded-full'
                />
              </View>
              <View className='w-14 h-14 bg-[#A69B8A1A] rounded-full p-1' />
              <View className='w-10 h-10 bg-[#A69B8A1A] rounded-full p-1' />
              <View className='w-12 h-12 bg-[#A69B8A1A] rounded-full p-1'>
                <Image
                  source={require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (2).png')}
                  resizeMode='contain'
                  className='w-full h-full rounded-full'
                />
              </View>
            </View>
            <View className='flex-row items-center gap-2 mb-4'>
              <View className='ml-16 w-4 h-4 bg-[transparent] rounded-full p-1' />
              <View className='w-8 h-8 bg-[#A69B8A1A] rounded-full p-1 mb-8' />
              <View className='w-12 h-12 bg-[#A69B8A1A] rounded-full p-1 mb-8' />
              <View className='w-8 h-8 bg-[#A69B8A1A] rounded-full p-1 mb-8' />
              <View className='w-4 h-4 bg-[transparent] rounded-full p-1' />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

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
    <View style={{ height: CARD_HEIGHT + 80, paddingVertical: 10 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment='start'
        decelerationRate='fast'
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
