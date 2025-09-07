import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontStyles } from '../../lib/fonts';
import { MonthlyProgress } from '../../lib/historyManager';

interface CalendarProps {
  monthlyProgress: MonthlyProgress;
  year?: number;
  month?: number; // 0-based (0 = January)
  showTitle?: boolean;
}

export const Calendar = memo(
  ({ monthlyProgress, year, month, showTitle = true }: CalendarProps) => {
    const currentDate = new Date();
    const displayYear = year ?? currentDate.getFullYear();
    const displayMonth = month ?? currentDate.getMonth();

    const calendarData = useMemo(() => {
      const monthNames = [
        'JANUARY',
        'FEBRUARY',
        'MARCH',
        'APRIL',
        'MAY',
        'JUNE',
        'JULY',
        'AUGUST',
        'SEPTEMBER',
        'OCTOBER',
        'NOVEMBER',
        'DECEMBER',
      ];

      const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

      const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
      const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

      const calendarDays = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < adjustedFirstDay; i++) {
        calendarDays.push(null);
      }

      // Add all days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
      }

      return {
        monthName: monthNames[displayMonth],
        daysOfWeek,
        calendarDays,
        currentDay: currentDate.getDate(),
        isCurrentMonth:
          displayYear === currentDate.getFullYear() && displayMonth === currentDate.getMonth(),
      };
    }, [displayYear, displayMonth]);

    return (
      <View className='px-6 mb-8'>
        {showTitle && (
          <View className='items-center mb-6'>
            <Text style={styles.monthTitle}>{calendarData.monthName}</Text>
          </View>
        )}

        <View style={styles.calendarContainer}>
          {/* Days of week header */}
          <View className='flex-row mb-4'>
            {calendarData.daysOfWeek.map((day, index) => (
              <View key={day} className='flex-1 items-center'>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className='flex-row flex-wrap'>
            {calendarData.calendarDays.map((date, index) => {
              const isToday = calendarData.isCurrentMonth && date === calendarData.currentDay;
              const isCompleted = date && monthlyProgress[date];

              return (
                <View key={index} style={styles.dayContainer} className='items-center mb-3'>
                  {date && (
                    <View
                      style={[
                        styles.dayCircle,
                        {
                          backgroundColor: isCompleted
                            ? '#A69B8A'
                            : isToday
                              ? '#374151'
                              : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: isCompleted || isToday ? '#FFFFFF' : '#374151',
                          },
                        ]}
                      >
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
  }
);

const styles = StyleSheet.create({
  monthTitle: {
    ...FontStyles.bodyMedium,
    color: '#A0A0A0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 16,
  },
  calendarContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 24,
  },
  dayLabel: {
    ...FontStyles.bodySmall,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  dayContainer: {
    width: '14.28%', // 100% / 7 days
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    ...FontStyles.bodyMedium,
    fontWeight: '600',
    fontSize: 16,
  },
});
