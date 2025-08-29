import React, { memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontStyles } from '../../lib/fonts';

const areaCategories: AreaCard[] = [
    {
        id: 1,
        title: 'Hips',
        image: require('../../../assets/yoga/Gemini_Generated_Image_fgc5gyfgc5gyfgc5.png'),
        color: '#E9D5FF'
    },
    {
        id: 2,
        title: 'Lower Back',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc.png'),
        color: '#D1FAE5'
    },
    {
        id: 3,
        title: 'Neck',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (1).png'),
        color: '#FEF3C7'
    },
    {
        id: 4,
        title: 'Shoulders',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (2).png'),
        color: '#D1FAE5'
    },
    {
        id: 5,
        title: 'Splits',
        image: require('../../../assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (3).png'),
        color: '#DBEAFE'
    },
    {
        id: 6,
        title: 'Hamstrings',
        image: require('../../../assets/yoga/images_1.png'),
        color: '#FEE2E2'
    }
];

const renderAreaCard = ({ area, handleAreaPress }: { area: AreaCard, handleAreaPress: (area: AreaCard) => void }) => (
    <TouchableOpacity
        key={area.id}
        onPress={() => handleAreaPress(area)}
        style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            padding: 16,
            marginRight: 16,
            width: 140,
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#A69B8A66',
        }}
        activeOpacity={0.7}
    >
        <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: area.color,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            overflow: 'hidden',
            marginTop: 10,
        }}>
            <Image
                source={area.image}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                }}
                resizeMode="cover"
            />
        </View>
        <Text style={[FontStyles.bodyMedium, {
            color: '#000000',
            fontWeight: '700',
            fontSize: 14,
            marginTop: -10,
            textAlign: 'center',
        }]}>
            {area.title}
        </Text>
    </TouchableOpacity>
);

interface AreaCard {
    id: number;
    title: string;
    image: any;
    color: string;
}

const BrowseByArea = () => {
    const handleAreaPress = (area: AreaCard) => {
        console.log(`Selected area: ${area.title}`);
    };

    return (
        <View className="px-6 py-6">
            <Text style={[FontStyles.bodyMedium, {
                color: '#A69B8A',
                fontWeight: '700',
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: 16,
            }]}>
                BROWSE BY AREA
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingRight: 16,
                }}
            >
                <View>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        {areaCategories.slice(0, 3).map((area) => renderAreaCard({ area, handleAreaPress }))}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {areaCategories.slice(3, 6).map((area) => renderAreaCard({ area, handleAreaPress }))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default BrowseByArea;
