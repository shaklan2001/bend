import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/Button';

export default function IntroScreen() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/(onboarding)');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-8">
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-gray-800 mb-4">
                        🚀 Welcome to BendApp
                    </Text>
                    <Text className="text-lg text-gray-600 text-center mb-8">
                        Your journey to better health and wellness starts here
                    </Text>
                    <Text className="text-base text-gray-500 text-center leading-6">
                        Discover personalized fitness routines, track your progress, and achieve your goals with our comprehensive health platform.
                    </Text>
                </View>

                <View className="w-full">
                    <Button
                        title="Get Started"
                        onPress={handleGetStarted}
                        className="bg-blue-600 py-4 px-8 rounded-lg"
                        textClassName="text-white text-lg font-semibold"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
