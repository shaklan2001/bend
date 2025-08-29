import React, { useState, useRef, useEffect, memo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, FontStyles } from '../../lib/fonts';
import Button from '../Button';

interface CreateAccountSheetProps {
    visible: boolean;
    onClose: () => void;
    onSwitchToLogIn?: () => void;
}

export const MemoizedInput = memo(({
    value,
    onChangeText,
    placeholder,
    placeholderTextColor,
    keyboardType,
    autoCapitalize,
    secureTextEntry
}: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    placeholderTextColor: string;
    keyboardType?: any;
    autoCapitalize?: any;
    secureTextEntry?: boolean;
}) => (
    <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: '#E5E7EB',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 16,
            fontSize: 16,
            color: '#000000',
        }}
    />
));


const CreateAccountSheet: React.FC<CreateAccountSheetProps> = ({ visible, onClose, onSwitchToLogIn }) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');

    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const contentSlideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            slideAnim.setValue(-1000);
            fadeAnim.setValue(0);
            contentSlideAnim.setValue(50);

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(contentSlideAnim, {
                    toValue: 0,
                    duration: 500,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -1000,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(contentSlideAnim, {
                    toValue: 50,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleContinue = () => {
        console.log('Create Account:', { firstName, email, confirmEmail, password });
    };

    const handleLogIn = () => {
        if (onSwitchToLogIn) {
            onSwitchToLogIn();
        }
    };


    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    opacity: fadeAnim,
                }}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        transform: [{ translateX: slideAnim }],
                    }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    padding: 8,
                                }}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color="#6B7280" />
                            </TouchableOpacity>

                            <Text style={[FontStyles.heading2, {
                                color: '#000000',
                                fontWeight: '700',
                                flex: 1,
                                textAlign: 'center',
                            }]}>
                                Create Account
                            </Text>

                            <View style={{ width: 40 }} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={{ flex: 1 }}
                            >
                                <ScrollView
                                    className="flex-1 px-6 py-6"
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <Animated.View style={{
                                        transform: [{ translateY: contentSlideAnim }],
                                        opacity: contentSlideAnim.interpolate({
                                            inputRange: [0, 50],
                                            outputRange: [1, 0],
                                        }),
                                    }}>
                                        {/* Instructional Text */}
                                        <Text style={[FontStyles.bodyMedium, {
                                            color: '#6B7280',
                                            textAlign: 'center',
                                            marginBottom: 40,
                                            lineHeight: 22,
                                        }]}>
                                            Create an account to save your progress and profile.
                                        </Text>

                                        {/* Form Fields with increased spacing */}
                                        <View className="space-y-6 mb-16 gap-2">
                                            <MemoizedInput
                                                value={firstName}
                                                onChangeText={setFirstName}
                                                placeholder="First Name"
                                                placeholderTextColor="#9CA3AF"
                                            />

                                            <MemoizedInput
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder="Email address"
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />

                                            <MemoizedInput
                                                value={confirmEmail}
                                                onChangeText={setConfirmEmail}
                                                placeholder="Confirm email address"
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />

                                            <MemoizedInput
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholder="Password"
                                                placeholderTextColor="#9CA3AF"
                                                secureTextEntry
                                            />
                                        </View>

                                        <View className="items-center mb-2 flex-row justify-center">
                                            <Text style={[FontStyles.bodyMedium, { color: '#6B7280' }]}>
                                                Already have an account?{' '}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={handleLogIn}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={{
                                                    color: '#A69B8A',
                                                    fontWeight: '700',
                                                    fontSize: 16,
                                                }}>
                                                    Log In
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <Button
                                            title="Continue"
                                            onPress={handleContinue}
                                            className="py-4 px-8 rounded-full w-full mb-8"
                                            style={{ backgroundColor: '#A69B8A' }}
                                            textClassName="text-white text-lg font-semibold tracking-wider"
                                        />
                                    </Animated.View>
                                </ScrollView>
                            </KeyboardAvoidingView>

                            <Animated.View
                                className="px-6 pb-6"
                                style={{
                                    transform: [{ translateY: contentSlideAnim }],
                                    opacity: contentSlideAnim.interpolate({
                                        inputRange: [0, 50],
                                        outputRange: [1, 0],
                                    }),
                                }}
                            >
                                <Text style={[FontStyles.bodySmall, {
                                    color: '#9CA3AF',
                                    textAlign: 'center'
                                }]}>
                                    By creating an account, you agree to our <Text style={{ color: '#A69B8A', fontWeight: '700' }}>Terms of Service</Text> and acknowledge that you have read our <Text style={{ color: '#A69B8A', fontWeight: '700' }}>Privacy Policy</Text>, which explains how to opt out of offers and promos.
                                </Text>
                            </Animated.View>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default memo(CreateAccountSheet);
