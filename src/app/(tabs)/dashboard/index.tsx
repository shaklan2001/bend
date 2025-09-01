import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { FontStyles } from '../../../lib/fonts';
import { ShareButton } from '../../../components/Button';
import * as Haptics from 'expo-haptics';


const Header = memo(() => (
  <View className="items-center py-4">
    <Text style={[FontStyles.heading2, { color: '#111827', fontWeight: '700' }]}>
      Dashboard
    </Text>
  </View>
));

const TabNavigation = memo(({ activeTab, onTabChange }: {
  activeTab: 'stats' | 'history',
  onTabChange: (tab: 'stats' | 'history') => void
}) => (
  <View className="px-12 mb-6">
    <View style={{
      backgroundColor: '#F3F4F6',
      borderRadius: 50,
      padding: 4,
      flexDirection: 'row',
    }}>
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
        <Text style={[FontStyles.bodyMedium, {
          color: activeTab === 'stats' ? '#111827' : '#6B7280',
          fontWeight: '600',
          fontSize: 16,
        }]}>
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
        <Text style={[FontStyles.bodyMedium, {
          color: activeTab === 'history' ? '#111827' : '#6B7280',
          fontWeight: '600',
          fontSize: 16,
        }]}>
          HISTORY
        </Text>
      </TouchableOpacity>
    </View>
  </View>
));

const Bendometer = memo(() => {
  const progress = 0;
  const strokeWidth = 18;
  const radius = 145;

  return (
    <View className="items-center mb-8">
      <View className="relative">
        <View style={{
          width: (radius + strokeWidth) * 2,
          height: (radius + strokeWidth) * 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            position: 'absolute',
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: '#E5E7EB',
            borderRightColor: 'transparent',
            transform: [{ rotate: '90deg' }],
          }} />
          
          {progress > 0 && (
            <View style={{
              position: 'absolute',
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderLeftColor: '#3B82F6',
              transform: [{ rotate: '-45deg' }],
            }} />
          )}
          
          <View style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#8B7355',
            left: radius - radius * 0.707 - 8 + strokeWidth,
            top: radius + radius * 0.707 - 8 + strokeWidth,
          }} />
        </View>
        
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={[FontStyles.heading1, { 
            color: '#111827', 
            fontWeight: '800',
            fontSize: 60,
            lineHeight: 70,
          }]}>
            {progress}%
          </Text>
        </View>
      </View>
    </View>
  );
});

const StatCard = memo(({ title, value, icon }: {
  title: string,
  value: string,
  icon?: string
}) => (
  <View style={{
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
  }}>
    <Text style={[{
      color: '#A69B8A',
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 8,
      paddingHorizontal: 4,
      fontSize: 16,
    }]}>
      {title}
    </Text>
    <Text style={[{
      color: '#111827',
      fontWeight: '700',
      fontSize: 28,
      lineHeight: 32,
    }]}>
      {value}
    </Text>
  </View>
));

const StatsSection = memo(() => (
  <View className="px-6 mb-14">
    <Text style={[FontStyles.bodyMedium, {
      color: '#6B7280',
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 8,
      opacity: 0.8,
    }]}>
      MY STATS
    </Text>

    <View className="flex-row">
      <StatCard title="ACTIVE STREAK" value="-" />
      <StatCard title="LONGEST STREAK" value="-" />
    </View>

    <View className="flex-row mt-6">
      <StatCard title="DAYS COMPLETED" value="-" />
      <StatCard title="LAST STRETCH" value="-" />
    </View>
  </View>
));

const ActionButtons = memo(() => {
  const handleRestoreStreak = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleShareStats = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <View className="px-8 mb-6 gap-2">
      <ShareButton
        title="Restore Streak"
        icon="restore"
        size="lg"
        onPress={handleRestoreStreak}
      />

      <ShareButton
        title="Share Stats"
        icon="share-variant"
        size="lg"
        onPress={handleShareStats}
      />
    </View>
  );
});

const Calendar = memo(() => {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentMonth = 'SEPTEMBER';
  
  const firstDayOfMonth = 0;
  const daysInMonth = 30;
  
  const calendarDays = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <View className="px-6 mb-8">
      <View className="items-center mb-6">
        <Text style={[FontStyles.bodyMedium, {
          color: '#A0A0A0',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontSize: 16,
        }]}>
          {currentMonth}
        </Text>
      </View>

      <View style={{
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        padding: 24,
      }}>
        <View className="flex-row mb-4">
          {daysOfWeek.map((day, index) => (
            <View key={day} className="flex-1 items-center">
              <Text style={[FontStyles.bodySmall, {
                color: '#9CA3AF',
                fontWeight: '600',
                textTransform: 'uppercase',
                fontSize: 12,
              }]}>
                {day}
              </Text>
            </View>
          ))}
        </View>
        
        <View className="flex-row flex-wrap">
          {calendarDays.map((date, index) => {
            const isToday = date === 1;
            return (
              <View key={index} style={{ width: '14.28%' }} className="items-center mb-3">
                {date && (
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: isToday ? '#374151' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={[FontStyles.bodyMedium, {
                      color: isToday ? '#FFFFFF' : '#374151',
                      fontWeight: '600',
                      fontSize: 16,
                    }]}>
                      {date}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
});

const HistorySection = memo(() => (
  <View className="px-6 mb-8">
    <Text style={[FontStyles.bodyMedium, {
      color: '#9CA3AF',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 16,
      fontSize: 14,
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 8,
      opacity: 0.8,
    }]}>
      MY HISTORY
    </Text>

    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      minHeight: 100,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={[FontStyles.bodyMedium, {
        color: '#9CA3AF',
        fontWeight: '500',
        fontSize: 16,
      }]}>
        No routines to display
      </Text>
    </View>
  </View>
));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  const handleTabChange = useCallback((tab: 'stats' | 'history') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const renderContent = useMemo(() => {
    if (activeTab === 'stats') {
      return (
        <>
          <Bendometer />
          <StatsSection />
          <ActionButtons />
        </>
      );
    } else {
      return (
        <>
          <Calendar />
          <HistorySection />
        </>
      );
    }
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderContent}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;