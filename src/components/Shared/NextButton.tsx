import { FontStyles } from '@src/lib/fonts';
import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const NextButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: '100%',
      backgroundColor: '#F8F9FA',
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 56,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.24,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: '#E9ECEF',
    }}
  >
    <Text
      style={[
        FontStyles.button,
        {
          color: '#6C757D',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontWeight: '500',
          fontSize: 16,
        },
      ]}
    >
      Next
    </Text>
  </TouchableOpacity>
));
