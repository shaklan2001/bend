import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Fonts, FontStyles } from '../../../lib/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import YogaCarousel from '../../../components/HomePage/YogaCarousel';
import SearchModal from '../../../components/SearchModal';
import BrowseByArea from '../../../components/HomePage/BrowseByArea';
import RecommendedRoutines from '../../../components/HomePage/RecommendedRoutines';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const HomeHeader = memo(({ day, month, dayName, handleProfilePress, handleResetPress }: {
    day: number,
    month: string,
    dayName: string,
    handleProfilePress: () => void,
    handleResetPress: () => void
}) => {
    return (
        <View className="px-6 pt-4 ">
            <View className="flex-row justify-between items-start border-b border-gray-200 pb-4">
                <View className="flex-1">
                    <Text style={[FontStyles.bodyMedium, { color: '#9CA3AF', marginBottom: 4, fontWeight: '600' }]}>
                        {day} {month}
                    </Text>
                    <Text style={[FontStyles.heading1, { color: '#000000', fontWeight: '700', fontSize: 36, marginTop: 2 }]}>
                        {dayName}
                    </Text>
                </View>

                <View className="flex-row items-center space-x-3 gap-2">
                    <TouchableOpacity
                        onPress={handleResetPress}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            backgroundColor: '#EF4444',
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.30,
                            shadowRadius: 8.84,
                            elevation: 5,
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                            RESET
                        </Text>
                    </TouchableOpacity>

                    {/* Profile Button */}
                    <TouchableOpacity
                        onPress={handleProfilePress}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            marginTop: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.30,
                            shadowRadius: 8.84,
                            elevation: 5,
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="account" size={28} color="#808080" />
                        <View style={{
                            position: 'absolute',
                            top: 1,
                            right: 1,
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#EF4444',
                        }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
});

const SearchButton = memo(({ handleSearchPress }: { handleSearchPress: () => void }) => {
    return (
        <View className="px-6 py-4">
            <TouchableOpacity
                onPress={handleSearchPress}
                style={{
                    borderRadius: 40,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={['#F3F4F6', '#E5E7EB', '#D1D5DB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 20,
                    }}
                />
                <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color="#6B7280"
                    style={{ marginRight: 12, zIndex: 1 }}
                />
                <Text style={{
                    color: '#6B7280',
                    fontSize: 16,
                    fontWeight: '500',
                    zIndex: 1,
                }}>
                    Search for a routine
                </Text>
            </TouchableOpacity>
        </View>
    )
});

const Home = () => {
    const router = useRouter();
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    const getCurrentDate = () => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const dayName = now.toLocaleString('en-US', { weekday: 'long' });

        return { day, month, dayName };
    };

    const { day, month, dayName } = getCurrentDate();

    const handleProfilePress = () => {
        router.push('/(tabs)/(home)/profile');
    };

    const handleResetPress = async () => {
        try {
            // Get all keys from AsyncStorage
            const allKeys = await AsyncStorage.getAllKeys();

            // Filter keys that are related to onboarding/user data
            const keysToRemove = allKeys.filter(key =>
                key.includes('onboarding') ||
                key.includes('user') ||
                key.includes('preference') ||
                key.includes('answer') ||
                key.includes('step') ||
                key.includes('completed') ||
                key.includes('first_time')
            );

            // Remove all onboarding-related keys
            if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
                console.log('Cleared keys:', keysToRemove);
            }

            // Navigate to intro screen instead of onboarding
            router.replace('/intro');
        } catch (error) {
            console.error('Error resetting onboarding state:', error);
        }
    };

    const handleSearchPress = () => {
        setIsSearchModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />


            <ScrollView>
                <HomeHeader
                    day={day}
                    month={month}
                    dayName={dayName}
                    handleProfilePress={handleProfilePress}
                    handleResetPress={handleResetPress}
                />
                <YogaCarousel />
                <SearchButton handleSearchPress={handleSearchPress} />
                <BrowseByArea />
                <RecommendedRoutines />

            </ScrollView>
            <SearchModal
                visible={isSearchModalVisible}
                onClose={() => setIsSearchModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default Home;