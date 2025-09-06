import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
    id: string;
    name: string;
    duration: number; // in minutes
    image_url?: string;
    slug: string;
    completedAt: number; // timestamp
    exercisesCount?: number;
    totalMinutes?: number;
}

export interface MonthlyProgress {
    [day: number]: boolean;
}

const HISTORY_STORAGE_KEY = 'bendapp_routine_history';

/**
 * Get current date in YYYY-MM-DD format
 */
function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get month and year for grouping
 */
function getMonthYear(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Load history from AsyncStorage
 */
export async function loadHistory(): Promise<HistoryItem[]> {
    try {
        const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
            const parsedHistory: HistoryItem[] = JSON.parse(savedHistory);
            return parsedHistory.sort((a, b) => b.completedAt - a.completedAt); // Most recent first
        }
        return [];
    } catch (error) {
        console.error('Error loading history:', error);
        return [];
    }
}

/**
 * Save history to AsyncStorage
 */
export async function saveHistory(history: HistoryItem[]): Promise<boolean> {
    try {
        await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Error saving history:', error);
        return false;
    }
}

/**
 * Add a routine completion to history
 */
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
        const currentHistory = await loadHistory();

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

        // Add to beginning of array (most recent first)
        const updatedHistory = [historyItem, ...currentHistory];

        // Keep only last 100 items to prevent storage bloat
        const limitedHistory = updatedHistory.slice(0, 100);

        return await saveHistory(limitedHistory);
    } catch (error) {
        console.error('Error adding to history:', error);
        return false;
    }
}

/**
 * Get history grouped by date
 */
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

/**
 * Get monthly progress for calendar
 */
export async function getMonthlyProgress(year: number, month: number): Promise<MonthlyProgress> {
    const history = await loadHistory();
    const monthlyProgress: MonthlyProgress = {};

    // Filter history for the specific month
    const filteredHistory = history.filter(item => {
        const date = new Date(item.completedAt);
        return date.getFullYear() === year && date.getMonth() === month;
    });

    // Group by day
    filteredHistory.forEach(item => {
        const day = new Date(item.completedAt).getDate();
        monthlyProgress[day] = true;
    });

    return monthlyProgress;
}

/**
 * Get recent history (last 30 days)
 */
export async function getRecentHistory(limit: number = 10): Promise<HistoryItem[]> {
    const history = await loadHistory();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    return history
        .filter(item => item.completedAt > thirtyDaysAgo)
        .slice(0, limit);
}

/**
 * Get history for today
 */
export async function getTodayHistory(): Promise<HistoryItem[]> {
    const history = await loadHistory();
    const today = getTodayString();

    return history.filter(item => {
        const itemDate = new Date(item.completedAt).toISOString().split('T')[0];
        return itemDate === today;
    });
}

/**
 * Clear all history (for testing or reset purposes)
 */
export async function clearHistory(): Promise<void> {
    try {
        await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        console.log('✅ History cleared successfully');
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}

/**
 * Format completion time relative to now
 */
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
