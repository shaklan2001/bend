import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Fonts, FontStyles } from '../../../lib/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import YogaCarousel from '../../../components/YogaCarousel';


const HomeHeader = memo(({ day, month, dayName, handleProfilePress }: { day: number, month: string, dayName: string, handleProfilePress: () => void }) => {
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
    )
});

const Home = () => {
    const router = useRouter();

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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            <HomeHeader day={day} month={month} dayName={dayName} handleProfilePress={handleProfilePress} />
            <YogaCarousel />
        </SafeAreaView>
    );
};

export default Home;