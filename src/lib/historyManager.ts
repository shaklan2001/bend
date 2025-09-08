import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './auth';
import { supabase } from './supabase';

export interface HistoryItem {
  id: string;
  name: string;
  duration: number;
  image_url?: string;
  slug: string;
  completedAt: number;
  exercisesCount?: number;
  totalMinutes?: number;
}

export interface DatabaseHistoryItem {
  id: string;
  user_id: string;
  routine_type: string;
  routine_id: string;
  routine_name: string;
  routine_slug: string;
  duration_minutes: number;
  exercises_count: number;
  completed_at: string;
  completion_percentage: number;
  calories_burned: number;
  image_url?: string | null;
}

export interface MonthlyProgress {
  [day: number]: boolean;
}

const HISTORY_STORAGE_KEY = 'bendapp_routine_history';

function convertToDatabaseFormat(
  item: HistoryItem,
  userId: string
): Omit<DatabaseHistoryItem, 'id'> {
  return {
    user_id: userId,
    routine_type: 'yoga',
    routine_id: item.id,
    routine_name: item.name,
    routine_slug: item.slug,
    duration_minutes: item.duration,
    exercises_count: item.exercisesCount || 0,
    completed_at: new Date(item.completedAt).toISOString(),
    completion_percentage: 100,
    calories_burned: Math.round(item.duration * 3.5),
    image_url: item.image_url || null,
  };
}

function convertFromDatabaseFormat(item: DatabaseHistoryItem): HistoryItem {
  return {
    id: item.routine_id,
    name: item.routine_name,
    duration: item.duration_minutes,
    slug: item.routine_slug,
    completedAt: new Date(item.completed_at).getTime(),
    exercisesCount: item.exercises_count,
    totalMinutes: item.duration_minutes,
    image_url: item.image_url,
  };
}

async function saveToDatabase(item: HistoryItem): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping database save');
      return false;
    }

    const dbItem = convertToDatabaseFormat(item, user.id);
    const { error } = await supabase.from('user_history').insert([dbItem]);

    if (error) {
      console.error('Error saving to database:', error);
      return false;
    }

    console.log('✅ History item saved to database');
    return true;
  } catch (error) {
    console.error('Error saving to database:', error);
    return false;
  }
}

async function loadFromDatabase(): Promise<HistoryItem[]> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping database load');
      return [];
    }

    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error loading from database:', error);
      return [];
    }

    return data.map(convertFromDatabaseFormat);
  } catch (error) {
    console.error('Error loading from database:', error);
    return [];
  }
}

export async function syncLocalHistoryToDatabase(): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping sync');
      return false;
    }

    const localHistory = await loadLocalHistory();
    if (localHistory.length === 0) {
      console.log('No local history to sync');
      return true;
    }

    const { data: existingHistory } = await supabase
      .from('user_history')
      .select('routine_id, completed_at')
      .eq('user_id', user.id)
      .limit(1);

    if (existingHistory && existingHistory.length > 0) {
      console.log('User already has history in database, skipping sync');
      return true;
    }

    const dbItems = localHistory.map(item => convertToDatabaseFormat(item, user.id));

    const { error } = await supabase.from('user_history').insert(dbItems);

    if (error) {
      console.error('Error syncing to database:', error);
      return false;
    }

    console.log(`✅ Synced ${localHistory.length} history items to database`);
    return true;
  } catch (error) {
    console.error('Error syncing to database:', error);
    return false;
  }
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const user = authService.getCurrentUserFromState();

    if (user) {
      const dbHistory = await loadFromDatabase();
      if (dbHistory.length > 0) {
        return dbHistory;
      }

      const localHistory = await loadLocalHistory();
      if (localHistory.length > 0) {
        await syncLocalHistoryToDatabase();
        return localHistory;
      }

      return [];
    } else {
      return await loadLocalHistory();
    }
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

async function loadLocalHistory(): Promise<HistoryItem[]> {
  try {
    const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      const parsedHistory: HistoryItem[] = JSON.parse(savedHistory);
      return parsedHistory.sort((a, b) => b.completedAt - a.completedAt);
    }
    return [];
  } catch (error) {
    console.error('Error loading local history:', error);
    return [];
  }
}

export async function saveHistory(history: HistoryItem[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving history:', error);
    return false;
  }
}

export async function addToHistory(routine: {
  id: string;
  name: string;
  duration: number;
  image_url?: string;
  slug: string;
  exercisesCount?: number;
  totalMinutes?: number;
}): Promise<boolean> {
  try {
    const historyItem: HistoryItem = {
      id: routine.id,
      name: routine.name,
      duration: routine.duration,
      image_url: routine.image_url,
      slug: routine.slug,
      completedAt: Date.now(),
      exercisesCount: routine.exercisesCount,
      totalMinutes: routine.totalMinutes,
    };

    const user = authService.getCurrentUserFromState();
    if (user) {
      const dbSuccess = await saveToDatabase(historyItem);
      if (dbSuccess) {
        return true;
      }
    }

    const currentHistory = await loadLocalHistory();
    const updatedHistory = [historyItem, ...currentHistory];
    const limitedHistory = updatedHistory.slice(0, 100);

    const localSuccess = await saveHistory(limitedHistory);
    if (localSuccess) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error adding to history:', error);
    return false;
  }
}

export async function getGroupedHistory(): Promise<{ [date: string]: HistoryItem[] }> {
  const history = await loadHistory();
  const grouped: { [date: string]: HistoryItem[] } = {};

  history.forEach(item => {
    const date = new Date(item.completedAt).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  return grouped;
}

export async function getMonthlyProgress(year: number, month: number): Promise<MonthlyProgress> {
  const history = await loadHistory();
  const monthlyProgress: MonthlyProgress = {};

  const filteredHistory = history.filter(item => {
    const date = new Date(item.completedAt);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  filteredHistory.forEach(item => {
    const day = new Date(item.completedAt).getDate();
    monthlyProgress[day] = true;
  });

  return monthlyProgress;
}

export async function getRecentHistory(limit: number = 10): Promise<HistoryItem[]> {
  const history = await loadHistory();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return history.filter(item => item.completedAt > thirtyDaysAgo).slice(0, limit);
}

export async function getTodayHistory(): Promise<HistoryItem[]> {
  const history = await loadHistory();
  const today = getTodayString();

  return history.filter(item => {
    const itemDate = new Date(item.completedAt).toISOString().split('T')[0];
    return itemDate === today;
  });
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    console.log('✅ History cleared successfully');
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

export function formatCompletionTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}
