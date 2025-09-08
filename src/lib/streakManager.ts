import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToHistory } from './historyManager';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  weeklyData: boolean[]; // 7 days, index 0 = today, 1 = yesterday, etc.
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

/**
 * Get the current date in YYYY-MM-DD format
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Load streak data from AsyncStorage
 */
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

/**
 * Save streak data to AsyncStorage
 */
export async function saveStreakData(streakData: StreakData): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
}

/**
 * Check if user has an active streak (completed yesterday or today)
 */
export function hasActiveStreak(streakData: StreakData): boolean {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Has active streak if completed today or yesterday
  return streakData.lastCompletionDate === today || streakData.lastCompletionDate === yesterday;
}

/**
 * Check if user completed routine today
 */
export function completedToday(streakData: StreakData): boolean {
  return streakData.lastCompletionDate === getTodayString();
}

/**
 * Mark today's routine as completed and update streak
 */
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

  // Always add to history if routine data is provided (regardless of whether completed today)
  if (routineData) {
    await addToHistory(routineData);
  }

  // If already completed today, return current data (but history was still added above)
  if (currentData.lastCompletionDate === today) {
    return currentData;
  }

  const updatedData: StreakData = { ...currentData };

  // Update completion date
  updatedData.lastCompletionDate = today;
  updatedData.totalDaysCompleted += 1;

  // Update weekly data (shift array and mark today as completed)
  updatedData.weeklyData = [true, ...updatedData.weeklyData.slice(0, 6)];

  // Update streak logic
  if (currentData.lastCompletionDate) {
    const yesterday = getYesterdayString();
    if (currentData.lastCompletionDate === yesterday) {
      // Continuing streak
      updatedData.currentStreak += 1;
    } else {
      // Streak was broken, starting new one
      updatedData.currentStreak = 1;
    }
  } else {
    // First time completing
    updatedData.currentStreak = 1;
  }

  // Update longest streak
  if (updatedData.currentStreak > updatedData.longestStreak) {
    updatedData.longestStreak = updatedData.currentStreak;
  }

  // Award streak restore at 2-day streak
  if (updatedData.currentStreak === 2) {
    updatedData.streakRestoresAvailable += 1;
  }

  await saveStreakData(updatedData);
  return updatedData;
}

/**
 * Reset streak (when user misses days)
 */
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

/**
 * Use a streak restore
 */
export async function useStreakRestore(): Promise<StreakData | null> {
  const currentData = await loadStreakData();

  if (currentData.streakRestoresAvailable <= 0) {
    return null; // No restores available
  }

  const yesterday = getYesterdayString();
  const updatedData: StreakData = {
    ...currentData,
    streakRestoresAvailable: currentData.streakRestoresAvailable - 1,
    lastCompletionDate: yesterday,
    currentStreak: currentData.currentStreak > 0 ? currentData.currentStreak : 1,
    weeklyData: [false, true, ...currentData.weeklyData.slice(0, 5)], // Mark yesterday as completed
  };

  await saveStreakData(updatedData);
  return updatedData;
}

/**
 * Get dashboard statistics
 */
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

/**
 * Generate monthly progress data
 */
function generateMonthlyProgress(streakData: StreakData): { [day: number]: boolean } {
  const monthlyData: { [day: number]: boolean } = {};
  const today = new Date();
  const currentDay = today.getDate();

  // For now, just mark today if completed
  if (streakData.lastCompletionDate === getTodayString()) {
    monthlyData[currentDay] = true;
  }

  return monthlyData;
}

/**
 * Check if user should see success modal (no active streak) or streak screen (has active streak)
 */
export async function shouldShowSuccessModal(): Promise<boolean> {
  const streakData = await loadStreakData();

  // Show success modal if:
  // 1. User has no active streak (starting fresh)
  // 2. User's current streak is 0 (broken streak)
  // 3. User hasn't completed anything yet

  return !hasActiveStreak(streakData) || streakData.currentStreak === 0;
}

/**
 * Get streak data for streak screen
 */
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

/**
 * Initialize streak data for new users
 */
export async function initializeStreakData(): Promise<StreakData> {
  const existingData = await loadStreakData();

  // If data already exists, return it
  if (existingData.totalDaysCompleted > 0 || existingData.currentStreak > 0) {
    return existingData;
  }

  // Initialize with default data
  await saveStreakData(DEFAULT_STREAK_DATA);
  return DEFAULT_STREAK_DATA;
}

/**
 * Clear all streak data (for testing or reset purposes)
 */
export async function clearStreakData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STREAK_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing streak data:', error);
  }
}
