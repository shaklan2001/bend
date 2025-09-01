import React, { useState, useRef, useEffect, memo } from 'react';
import {
    View,
    Text,
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
import { MemoizedInput } from './CreateAccountSheet';

interface LogInSheetProps {
    visible: boolean;
    onClose: () => void;
    onSwitchToCreateAccount?: () => void;
}


const LogInSheet: React.FC<LogInSheetProps> = ({ visible, onClose, onSwitchToCreateAccount }) => {
    const [email, setEmail] = useState('');
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

    const handleLogIn = () => {
        console.log('Log In:', { email, password });
    };

    const handleForgotPassword = () => {
        console.log('Forgot password pressed');
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
                                Log In
                            </Text>

                            <View style={{ width: 40 }} />
                        </View>

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
                                    <Text style={[FontStyles.bodyMedium, {
                                        color: '#6B7280',
                                        textAlign: 'center',
                                        marginBottom: 40,
                                        lineHeight: 22,
                                    }]}>
                                        Log in to your existing account.
                                    </Text>

                                    <View className="space-y-6 mb-16 gap-2">
                                        <MemoizedInput
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder="Email address"
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

                                    <Button
                                        title="Log In"
                                        onPress={handleLogIn}
                                        className="py-4 px-8 rounded-full w-full mb-2"
                                        style={{ backgroundColor: '#A69B8A' }}
                                        textClassName="text-white text-lg font-semibold tracking-wider"
                                    />

                                    <View className="items-center">
                                        <TouchableOpacity onPress={handleForgotPassword}>
                                            <Text style={[FontStyles.bodyMedium, {
                                                color: '#9CA3AF',
                                                textDecorationLine: 'underline',
                                                fontWeight: '600',
                                            }]}>
                                                Forgot your password?
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default memo(LogInSheet);
