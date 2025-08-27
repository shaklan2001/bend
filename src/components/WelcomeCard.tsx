import React from 'react';
import { View, Text } from 'react-native';
import Button from './Button';

interface Feature {
    title: string;
    description: string;
    icon: string;
}

const FEATURES: Feature[] = [
    {
        title: 'Profile Management',
        description: 'Easily update and manage your personal information, settings, and preferences',
        icon: '👤',
    },
    {
        title: 'Secure Messaging',
        description: 'Chat securely with friends and family in real-time.',
        icon: '💬',
    },
    {
        title: 'Activity Tracking',
        description: 'Monitor your daily activities and track your progress over time.',
        icon: '📊',
    },
];

export default function WelcomeCard() {
    return (
        <View className="bg-white rounded-2xl shadow-lg p-6 mx-4 mb-6">
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome to your
                </Text>
                <Text className="text-3xl font-bold text-blue-600">
                    Application
                </Text>
            </View>

            <View className="space-y-4">
                {FEATURES.map((feature, index) => (
                    <View key={index} className="flex-row items-start space-x-4">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                            <Text className="text-xl">{feature.icon}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800 mb-1">
                                {feature.title}
                            </Text>
                            <Text className="text-sm text-gray-600 leading-5">
                                {feature.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <Button className="mt-6">
                Get Started
            </Button>
        </View>
    );
}
