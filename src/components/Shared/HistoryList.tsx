import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from '../../lib/fonts';
import { formatCompletionTime, HistoryItem } from '../../lib/historyManager';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface HistoryListProps {
  items: HistoryItem[];
  showTitle?: boolean;
  title?: string;
  maxItems?: number;
  onItemPress?: (item: HistoryItem) => void;
}

const HistoryCard = memo(
  ({ item, onPress }: { item: HistoryItem; onPress: (item: HistoryItem) => void }) => {
    const handlePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(item);
    }, [item, onPress]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        className='bg-white mb-4 flex-row items-center'
        activeOpacity={0.7}
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: item.image_url || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=Yoga',
              }}
              style={styles.image}
              resizeMode='cover'
            />
          </View>
        </View>

        <View className='flex-1 ml-3'>
          <Text style={styles.routineName}>{item.name}</Text>
          <Text style={styles.duration}>{item.totalMinutes || item.duration} MINUTES</Text>
          <Text style={styles.timeAgo}>{formatCompletionTime(item.completedAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

export const HistoryList = memo(
  ({ items, showTitle = true, title = 'MY HISTORY', maxItems, onItemPress }: HistoryListProps) => {
    const displayItems = maxItems ? items.slice(0, maxItems) : items;

    const handleItemPress = useCallback(
      (item: HistoryItem) => {
        if (onItemPress) {
          onItemPress(item);
        } else {
          router.push(`/routine/${item.slug}`);
        }
      },
      [onItemPress]
    );

    if (displayItems.length === 0) {
      return (
        <View className='px-6 mb-8'>
          {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No routines to display</Text>
          </View>
        </View>
      );
    }

    return (
      <View className='px-6 mb-8'>
        {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}

        {displayItems.map((item, index) => (
          <HistoryCard
            key={`${item.id}-${item.completedAt}-${index}`}
            item={item}
            onPress={handleItemPress}
          />
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A69B8A2A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  routineName: {
    ...FontStyles.heading3,
    color: '#000000',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
  },
  duration: {
    ...FontStyles.bodyMedium,
    color: '#A69B8A',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  timeAgo: {
    ...FontStyles.bodySmall,
    color: '#9CA3AF',
    fontWeight: '500',
    fontSize: 12,
  },
  sectionTitle: {
    ...FontStyles.bodyMedium,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontSize: 14,
    letterSpacing: 1,
    opacity: 0.6,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FontStyles.bodyMedium,
    color: '#9CA3AF',
    fontWeight: '500',
    fontSize: 16,
  },
});
