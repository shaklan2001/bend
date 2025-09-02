import { memo } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { FontStyles } from "../../lib/fonts";


const Header = memo(({ onClose, title }: { onClose: () => void, title: string }) => (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    }}>
        <TouchableOpacity
            onPress={onClose}
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            activeOpacity={0.6}
        >
            <Entypo name="cross" size={34} color="#6B72808A" />
        </TouchableOpacity>

        <Text style={[FontStyles.heading2, {
            color: '#111827',
            fontWeight: '700',
        }]}>
            {title}
        </Text>

        <View style={{ width: 40 }} />
    </View>
));

export default Header;