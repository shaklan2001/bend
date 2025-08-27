import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import WelcomeCard from '../../src/components/WelcomeCard';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="pt-12 pb-8">
                    <Text className="text-center text-2xl font-bold text-gray-800 mb-2">
                        🏠 Home Dashboard
                    </Text>
                    <Text className="text-center text-gray-600 mb-8">
                        Welcome back! Here's your overview
                    </Text>
                </View>

                <View className="px-4">
                    <WelcomeCard />

                    <View className="mt-6 space-y-4">
                        <View className="bg-white p-6 rounded-xl shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                📈 Quick Stats
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Your progress at a glance
                            </Text>
                        </View>

                        <View className="bg-white p-6 rounded-xl shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                🎯 Today's Goals
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Stay on track with your daily objectives
                            </Text>
                        </View>

                        <View className="bg-white p-6 rounded-xl shadow-sm">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                🏃‍♂️ Recent Activity
                            </Text>
                            <Text className="text-sm text-gray-600">
                                Your latest workouts and achievements
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
