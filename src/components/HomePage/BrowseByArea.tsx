import React, { memo, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../lib/supabase';
import RoutineBottomSheet from './RoutineBottomSheet';

interface AreaCard {
    id: string;
    name: string;
    image_url: string;
    created_at: string;
}

interface Routine {
    id: string;
    name: string;
    description: string;
    total_duration_minutes: number;
    body_part_id: string;
    slug: string;
}

const AreaCardComponent = memo(({
    area,
    onPress
}: {
    area: AreaCard,
    onPress: (area: AreaCard) => void
}) => (
    <TouchableOpacity
        onPress={() => onPress(area)}
        className="bg-transparent rounded-2xl p-4 mr-4 w-[140px] h-[110px] items-center justify-center border-2 border-[#A69B8A66]"
        activeOpacity={0.7}
    >
        <View className="w-[55px] h-[55px] rounded-full bg-[#A69B8A3A] justify-center items-center mb-3 overflow-hidden mt-1.5">
            <Image
                source={{ uri: area?.image_url }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
            />
        </View>
        <Text className="text-sm font-bold text-black -mt-2.5 text-center">
            {area.name}
        </Text>
    </TouchableOpacity>
));

const SectionHeader = memo(({ title }: { title: string }) => (
    <Text className="text-base font-bold text-[#A69B8A] mb-5 uppercase tracking-wider">
        {title}
    </Text>
));

const LoadingState = memo(() => (
    <View className="px-6 py-6">
        <SectionHeader title="BROWSE BY AREA" />
        <Text className="text-base text-gray-400 text-center">
            Loading areas...
        </Text>
    </View>
));

const ErrorState = memo(({ error, onRetry }: { error: string, onRetry?: () => void }) => (
    <View className="px-6 py-6">
        <SectionHeader title="BROWSE BY AREA" />
        <View className="items-center space-y-3">
            <Text className="text-base text-red-500 text-center">
                {error}
            </Text>
            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    className="px-4 py-2 bg-red-500 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-white text-sm font-semibold">
                        Retry
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
));

const EmptyState = memo(() => (
    <View className="px-6 py-6">
        <SectionHeader title="BROWSE BY AREA" />
        <Text className="text-base text-gray-400 text-center">
            No areas available
        </Text>
    </View>
));

const AreaCardsRow = memo(({
    areas,
    onAreaPress
}: {
    areas: AreaCard[],
    onAreaPress: (area: AreaCard) => void
}) => (
    <View className="flex-row mb-4">
        {areas.map((area) => (
            <AreaCardComponent
                key={area.id}
                area={area}
                onPress={onAreaPress}
            />
        ))}
    </View>
));

const AreaCardsContainer = memo(({
    bodyParts,
    onAreaPress
}: {
    bodyParts: AreaCard[],
    onAreaPress: (area: AreaCard) => void
}) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingRight: 16,
        }}
    >
        <View>
            <AreaCardsRow
                areas={bodyParts.slice(0, 3)}
                onAreaPress={onAreaPress}
            />
            <AreaCardsRow
                areas={bodyParts.slice(3, 6)}
                onAreaPress={onAreaPress}
            />
        </View>
    </ScrollView>
));

interface BrowseByAreaProps {
    bodyParts?: AreaCard[];
    isLoading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

const BrowseByArea = memo(({ bodyParts = [], isLoading = false, error = null, onRetry }: BrowseByAreaProps) => {
    const [selectedBodyPart, setSelectedBodyPart] = useState<AreaCard | null>(null);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isRoutineBottomSheetVisible, setIsRoutineBottomSheetVisible] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);

    const handleAreaPress = useCallback(async (area: AreaCard) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedBodyPart(area);
        setIsRoutineBottomSheetVisible(true);
        await fetchRoutinesForBodyPart(area.id);
    }, []);

    const fetchRoutinesForBodyPart = useCallback(async (bodyPartId: string) => {
        try {
            setIsLoadingRoutines(true);

            const { data, error } = await supabase
                .from('routines')
                .select('*')
                .eq('body_part_id', bodyPartId);

            if (error) {
                console.error('Error fetching routines:', error);
                setRoutines([]);
            } else {
                console.log('Routines fetched successfully:', data);
                setRoutines(data || []);
            }
        } catch (error) {
            console.error('Unexpected error fetching routines:', error);
            setRoutines([]);
        } finally {
            setIsLoadingRoutines(false);
        }
    }, []);

    const handleCloseRoutineBottomSheet = useCallback(() => {
        setIsRoutineBottomSheetVisible(false);
        setSelectedBodyPart(null);
        setRoutines([]);
    }, []);

    const handleRetry = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRetry?.();
    }, [onRetry]);

    const shouldShowLoading = useMemo(() =>
        isLoading && (!bodyParts || bodyParts.length === 0),
        [isLoading, bodyParts]
    );

    const hasBodyParts = useMemo(() =>
        bodyParts && bodyParts.length > 0,
        [bodyParts]
    );

    if (shouldShowLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={handleRetry} />;
    }

    if (!hasBodyParts) {
        return <EmptyState />;
    }

    return (
        <>
            <View className="px-6 py-6">
                <SectionHeader title="BROWSE BY AREA" />
                <AreaCardsContainer
                    bodyParts={bodyParts}
                    onAreaPress={handleAreaPress}
                />
            </View>

            <RoutineBottomSheet
                visible={isRoutineBottomSheetVisible}
                onClose={handleCloseRoutineBottomSheet}
                bodyPart={selectedBodyPart}
                routines={routines}
                isLoading={isLoadingRoutines}
            />
        </>
    );
});

export default BrowseByArea;
