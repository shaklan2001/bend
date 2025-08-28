import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';

export default function OnboardingScreen() {
    const router = useRouter();

    const handleContinue = () => {
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 justify-center items-center px-8">
                <View className="items-center mb-12">
                    <Text className="text-3xl font-bold text-gray-800 mb-6">
                        🎯 Let's Get You Started
                    </Text>
                    <Text className="text-lg text-gray-600 text-center mb-8">
                        Complete your profile to get personalized recommendations
                    </Text>

                    <View className="w-full space-y-4 mb-8">
                        <View className="bg-white p-4 rounded-lg shadow-sm">
                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                ✅ Set Your Goals
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Define what you want to achieve with BendApp
                            </Text>
                        </View>

                        <View className="bg-white p-4 rounded-lg shadow-sm">
                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                📊 Track Progress
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Monitor your journey with detailed analytics
                            </Text>
                        </View>

                        <View className="bg-white p-4 rounded-lg shadow-sm">
                            <Text className="text-base font-semibold text-gray-800 mb-2">
                                🏆 Achieve Success
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Reach your milestones with our guided approach
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="w-full">
                    <Button
                        title="Continue to Home"
                        onPress={handleContinue}
                        className="bg-green-600 py-4 px-8 rounded-lg"
                        textClassName="text-white text-lg font-semibold"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
