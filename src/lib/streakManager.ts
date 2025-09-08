import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToHistory } from './historyManager';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  weeklyData: boolean[];
  totalDaysCompleted: number;
  lastStreakResetDate: string | null;
  streakRestoresAvailable: number;
}

export interface DashboardStats {
  activeStreak: number;
  longestStreak: number;
  daysCompleted: number;
  lastStretchDate: string | null;
  weeklyProgress: boolean[];
  monthlyProgress: { [day: number]: boolean };
}

const STREAK_STORAGE_KEY = 'bendapp_streak_data';
const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletionDate: null,
  weeklyData: [false, false, false, false, false, false, false],
  totalDaysCompleted: 0,
  lastStreakResetDate: null,
  streakRestoresAvailable: 0,
};

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export async function loadStreakData(): Promise<StreakData> {
  try {
    const savedData = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
    if (savedData) {
      const parsedData: StreakData = JSON.parse(savedData);
      return { ...DEFAULT_STREAK_DATA, ...parsedData };
    }
    return DEFAULT_STREAK_DATA;
  } catch (error) {
    console.error('Error loading streak data:', error);
    return DEFAULT_STREAK_DATA;
  }
}

export async function saveStreakData(streakData: StreakData): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
}

export function hasActiveStreak(streakData: StreakData): boolean {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  return streakData.lastCompletionDate === today || streakData.lastCompletionDate === yesterday;
}

export function completedToday(streakData: StreakData): boolean {
  return streakData.lastCompletionDate === getTodayString();
}

export async function completeToday(routineData?: {
  id: string;
  name: string;
  duration: number;
  image_url?: string;
  slug: string;
  exercisesCount?: number;
  totalMinutes?: number;
}): Promise<StreakData> {
  const currentData = await loadStreakData();
  const today = getTodayString();

  if (routineData) {
    await addToHistory(routineData);
  }

  if (currentData.lastCompletionDate === today) {
    return currentData;
  }

  const updatedData: StreakData = { ...currentData };

  updatedData.lastCompletionDate = today;
  updatedData.totalDaysCompleted += 1;

  updatedData.weeklyData = [true, ...updatedData.weeklyData.slice(0, 6)];

  if (currentData.lastCompletionDate) {
    const yesterday = getYesterdayString();
    if (currentData.lastCompletionDate === yesterday) {
      updatedData.currentStreak += 1;
    } else {
      updatedData.currentStreak = 1;
    }
  } else {
    updatedData.currentStreak = 1;
  }

  if (updatedData.currentStreak > updatedData.longestStreak) {
    updatedData.longestStreak = updatedData.currentStreak;
  }

  if (updatedData.currentStreak === 2) {
    updatedData.streakRestoresAvailable += 1;
  }

  await saveStreakData(updatedData);
  return updatedData;
}

export async function resetStreak(): Promise<StreakData> {
  const currentData = await loadStreakData();
  const updatedData: StreakData = {
    ...currentData,
    currentStreak: 0,
    lastStreakResetDate: getTodayString(),
    weeklyData: [false, false, false, false, false, false, false],
  };

  await saveStreakData(updatedData);
  return updatedData;
}

export async function useStreakRestore(): Promise<StreakData | null> {
  const currentData = await loadStreakData();

  if (currentData.streakRestoresAvailable <= 0) {
    return null;
  }

  const yesterday = getYesterdayString();
  const updatedData: StreakData = {
    ...currentData,
    streakRestoresAvailable: currentData.streakRestoresAvailable - 1,
    lastCompletionDate: yesterday,
    currentStreak: currentData.currentStreak > 0 ? currentData.currentStreak : 1,
    weeklyData: [false, true, ...currentData.weeklyData.slice(0, 5)],
  };

  await saveStreakData(updatedData);
  return updatedData;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const streakData = await loadStreakData();

  return {
    activeStreak: hasActiveStreak(streakData) ? streakData.currentStreak : 0,
    longestStreak: streakData.longestStreak,
    daysCompleted: streakData.totalDaysCompleted,
    lastStretchDate: streakData.lastCompletionDate,
    weeklyProgress: streakData.weeklyData,
    monthlyProgress: generateMonthlyProgress(streakData),
  };
}

function generateMonthlyProgress(streakData: StreakData): { [day: number]: boolean } {
  const monthlyData: { [day: number]: boolean } = {};
  const today = new Date();
  const currentDay = today.getDate();

  if (streakData.lastCompletionDate === getTodayString()) {
    monthlyData[currentDay] = true;
  }
  return monthlyData;
}

export async function shouldShowSuccessModal(): Promise<boolean> {
  const streakData = await loadStreakData();
  return !hasActiveStreak(streakData) || streakData.currentStreak === 0;
}

export async function getStreakScreenData(): Promise<{
  currentStreak: number;
  weeklyData: boolean[];
  canRestore: boolean;
  streakRestoresAvailable: number;
}> {
  const streakData = await loadStreakData();
  return {
    currentStreak: streakData.currentStreak,
    weeklyData: streakData.weeklyData,
    canRestore: streakData.streakRestoresAvailable > 0,
    streakRestoresAvailable: streakData.streakRestoresAvailable,
  };
}

export async function initializeStreakData(): Promise<StreakData> {
  const existingData = await loadStreakData();

  if (existingData.totalDaysCompleted > 0 || existingData.currentStreak > 0) {
    return existingData;
  }

  await saveStreakData(DEFAULT_STREAK_DATA);
  return DEFAULT_STREAK_DATA;
}

export async function clearStreakData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STREAK_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing streak data:', error);
  }
}
