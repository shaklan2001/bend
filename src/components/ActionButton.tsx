import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from '../lib/fonts';

interface ActionButtonProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showNewTag?: boolean;
  variant?: 'default' | 'outline';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  subtitle,
  onPress,
  showNewTag = false,
  variant = 'default',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: variant === 'outline' ? '#E5E7EB' : 'transparent',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              FontStyles.bodyLarge,
              {
                color: '#000000',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                FontStyles.bodyMedium,
                {
                  color: '#9CA3AF',
                  fontWeight: '500',
                  fontSize: 14,
                  marginTop: 2,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {showNewTag && (
          <View
            style={{
              backgroundColor: '#EF4444',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              NEW
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
