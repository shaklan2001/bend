import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from '../../../lib/fonts';
import { ShareButton } from '../../../components/Button';
import * as Haptics from 'expo-haptics';
import { DashboardStats, getDashboardStats, useStreakRestore } from '../../../lib/streakManager';
import { Calendar } from '../../../components/Shared/Calendar';
import { HistoryList } from '../../../components/Shared/HistoryList';
import {
  clearHistory,
  getMonthlyProgress,
  HistoryItem,
  loadHistory,
} from '../../../lib/historyManager';

const Header = memo(() => (
  <View className='items-center py-4'>
    <Text style={[FontStyles.heading2, { color: '#111827', fontWeight: '700' }]}>Dashboard</Text>
  </View>
));

const TabNavigation = memo(
  ({
    activeTab,
    onTabChange,
  }: {
    activeTab: 'stats' | 'history';
    onTabChange: (tab: 'stats' | 'history') => void;
  }) => (
    <View className='px-12 mb-6'>
      <View
        style={{
          backgroundColor: '#F3F4F6',
          borderRadius: 50,
          padding: 4,
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          onPress={() => onTabChange('stats')}
          style={{
            flex: 1,
            backgroundColor: activeTab === 'stats' ? '#FFFFFF' : 'transparent',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 50,
            alignItems: 'center',
            shadowColor: activeTab === 'stats' ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: activeTab === 'stats' ? 0.1 : 0,
            shadowRadius: 2,
            elevation: activeTab === 'stats' ? 2 : 0,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              FontStyles.bodyMedium,
              {
                color: activeTab === 'stats' ? '#111827' : '#6B7280',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}
          >
            STATS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange('history')}
          style={{
            flex: 1,
            backgroundColor: activeTab === 'history' ? '#FFFFFF' : 'transparent',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 50,
            alignItems: 'center',
            shadowColor: activeTab === 'history' ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: activeTab === 'history' ? 0.1 : 0,
            shadowRadius: 2,
            elevation: activeTab === 'history' ? 2 : 0,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              FontStyles.bodyMedium,
              {
                color: activeTab === 'history' ? '#111827' : '#6B7280',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}
          >
            HISTORY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

const Bendometer = memo(() => {
  const progress = 0;
  const strokeWidth = 18;
  const radius = 145;

  return (
    <View className='items-center mb-8'>
      <View className='relative'>
        <View
          style={{
            width: (radius + strokeWidth) * 2,
            height: (radius + strokeWidth) * 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: '#E5E7EB',
              borderRightColor: 'transparent',
              transform: [{ rotate: '90deg' }],
            }}
          />

          {progress > 0 && (
            <View
              style={{
                position: 'absolute',
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderLeftColor: '#3B82F6',
                transform: [{ rotate: '-45deg' }],
              }}
            />
          )}

          <View
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#8B7355',
              left: radius - radius * 0.707 - 8 + strokeWidth,
              top: radius + radius * 0.707 - 8 + strokeWidth,
            }}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              FontStyles.heading1,
              {
                color: '#111827',
                fontWeight: '800',
                fontSize: 60,
                lineHeight: 70,
              },
            ]}
          >
            {progress}%
          </Text>
        </View>
      </View>
    </View>
  );
});

const StatCard = memo(({ title, value, icon }: { title: string; value: string; icon?: string }) => (
  <View
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 38,
      width: '50%',
      height: 155,
      padding: 20,
      flex: 1,
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.19,
      shadowRadius: 8,
      elevation: 3,
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}
  >
    <Text
      style={[
        {
          color: '#A69B8A',
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: 8,
          paddingHorizontal: 4,
          fontSize: 16,
        },
      ]}
    >
      {title}
    </Text>
    <Text
      style={[
        {
          color: '#111827',
          fontWeight: '700',
          fontSize: 28,
          lineHeight: 32,
        },
      ]}
    >
      {value}
    </Text>
  </View>
));

const StatsSection = memo(
  ({
    dashboardStats,
    isLoading,
  }: {
    dashboardStats: DashboardStats | null;
    isLoading: boolean;
  }) => {
    const formatLastStretch = (lastStretchDate: string | null) => {
      if (!lastStretchDate) return '-';
      const date = new Date(lastStretchDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      return `${diffDays} days ago`;
    };

    return (
      <View className='px-6 mb-14'>
        <Text
          style={[
            FontStyles.bodyMedium,
            {
              color: '#6B7280',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
              paddingBottom: 8,
              opacity: 0.8,
            },
          ]}
        >
          MY STATS
        </Text>

        <View className='flex-row'>
          <StatCard
            title='ACTIVE STREAK'
            value={isLoading ? '...' : dashboardStats?.activeStreak.toString() || '0'}
          />
          <StatCard
            title='LONGEST STREAK'
            value={isLoading ? '...' : dashboardStats?.longestStreak.toString() || '0'}
          />
        </View>

        <View className='flex-row mt-6'>
          <StatCard
            title='DAYS COMPLETED'
            value={isLoading ? '...' : dashboardStats?.daysCompleted.toString() || '0'}
          />
          <StatCard
            title='LAST STRETCH'
            value={isLoading ? '...' : formatLastStretch(dashboardStats?.lastStretchDate || null)}
          />
        </View>
      </View>
    );
  }
);

const ActionButtons = memo(
  ({
    dashboardStats,
    onStreakRestored,
  }: {
    dashboardStats: DashboardStats | null;
    onStreakRestored: () => void;
  }) => {
    const handleRestoreStreak = useCallback(async () => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const result = await useStreakRestore();
        if (result) {
          onStreakRestored();
          // You might want to show a success message here
        } else {
          // Show error or no restores available message
          console.log('No streak restores available');
        }
      } catch (error) {
        console.error('Error restoring streak:', error);
      }
    }, [onStreakRestored]);

    const handleShareStats = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Share functionality here
    }, []);

    const canRestoreStreak = dashboardStats && dashboardStats.activeStreak === 0;

    return (
      <View className='px-8 mb-6 gap-2'>
        <ShareButton
          title={canRestoreStreak ? 'Restore Streak' : 'Restore Streak (Not Available)'}
          icon='restore'
          size='lg'
          onPress={canRestoreStreak ? handleRestoreStreak : () => {}}
        />

        <ShareButton
          title='Share Stats'
          icon='share-variant'
          size='lg'
          onPress={handleShareStats}
        />
      </View>
    );
  }
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<{ [day: number]: boolean }>({});

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        const stats = await getDashboardStats();
        setDashboardStats(stats);

        const history = await loadHistory();
        setHistoryItems(history);

        const currentDate = new Date();
        const monthProgress = await getMonthlyProgress(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
        setMonthlyProgress(monthProgress);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTabChange = useCallback((tab: 'stats' | 'history') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const handleStreakRestored = useCallback(async () => {
    try {
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error reloading dashboard stats:', error);
    }
  }, []);

  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistory();
      const history = await loadHistory();
      setHistoryItems(history);

      const currentDate = new Date();
      const monthProgress = await getMonthlyProgress(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      setMonthlyProgress(monthProgress);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  const renderContent = useMemo(() => {
    if (activeTab === 'stats') {
      return (
        <>
          <Bendometer />
          <StatsSection dashboardStats={dashboardStats} isLoading={isLoading} />
          <ActionButtons dashboardStats={dashboardStats} onStreakRestored={handleStreakRestored} />
        </>
      );
    } else {
      return (
        <>
          <Calendar monthlyProgress={monthlyProgress} />

          {historyItems.length > 0 && (
            <View className='px-6 mb-4'>
              <TouchableOpacity
                onPress={handleClearHistory}
                className='bg-red-500 rounded-lg p-3'
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    FontStyles.bodyMedium,
                    { color: 'white', textAlign: 'center', fontWeight: '600' },
                  ]}
                >
                  🗑️ Clear Test History Data
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <HistoryList items={historyItems} maxItems={10} />
        </>
      );
    }
  }, [
    activeTab,
    dashboardStats,
    isLoading,
    handleStreakRestored,
    monthlyProgress,
    historyItems,
    handleClearHistory,
  ]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar />
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderContent}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
