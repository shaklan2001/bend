import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface CoverPreviewCardProps {
    exercises: Array<{
        id: string;
        name: string;
        image_url: string;
        duration_seconds: number;
    }>;
    routineName: string;
    onPress?: () => void;
    showTouchable?: boolean;
}

const CoverImage = memo(({ imageUrl, size = 50 }: { imageUrl: string; size?: number }) => {
    const imageStyle = useMemo(() => ({
        width: size,
        height: size,
        borderRadius: size,
    }), [size]);

    return (
        <Image
            source={{ uri: imageUrl }}
            style={imageStyle}
            resizeMode="cover"
        />
    );
});

const ImageContainer = memo(({
    children,
    size,
    backgroundColor = '#9CA3AF'
}: {
    children: React.ReactNode;
    size: number;
    backgroundColor?: string;
}) => {
    const containerStyle = useMemo(() => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        overflow: 'hidden' as const,
    }), [size, backgroundColor]);

    return <View style={containerStyle}>{children}</View>;
});

const RoutineName = memo(({ name }: { name: string }) => (
    <Text style={{
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    }}>
        {name || 'Custom'}
    </Text>
));

const DurationText = memo(({ minutes }: { minutes: number }) => (
    <Text style={{
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '700',
    }}>
        {minutes} MINUTES
    </Text>
));

const CoverPreviewCard = memo(({
    exercises,
    routineName,
    onPress,
    showTouchable = false
}: CoverPreviewCardProps) => {
    const totalDuration = useMemo(() =>
        exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0),
        [exercises]
    );

    const totalMinutes = useMemo(() =>
        Math.floor(totalDuration / 60),
        [totalDuration]
    );

    const selectedImages = useMemo(() =>
        exercises.slice(0, 3).map(ex => ex.image_url),
        [exercises]
    );

    const cardStyle = useMemo(() => ({
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 4,
    }), []);

    const imagesContainerStyle = useMemo(() => ({
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginBottom: 20,
        gap: 8,
    }), []);

    const handlePress = useCallback(() => {
        onPress?.();
    }, [onPress]);

    const cardContent = (
        <View style={cardStyle}>
            <View style={imagesContainerStyle}>
                <ImageContainer size={50}>
                    {selectedImages[2] && <CoverImage imageUrl={selectedImages[2]} size={50} />}
                </ImageContainer>

                <ImageContainer size={65}>
                    {selectedImages[0] && <CoverImage imageUrl={selectedImages[0]} size={65} />}
                </ImageContainer>

                <ImageContainer size={50}>
                    {selectedImages[1] && <CoverImage imageUrl={selectedImages[1]} size={50} />}
                </ImageContainer>
            </View>
            <RoutineName name={routineName} />
            <DurationText minutes={totalMinutes} />
        </View>
    );

    if (showTouchable && onPress) {
        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                className="mx-8 mb-4"
            >
                {cardContent}
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ marginBottom: 32 }}>
            {cardContent}
        </View>
    );
});

CoverPreviewCard.displayName = 'CoverPreviewCard';

export default CoverPreviewCard;
