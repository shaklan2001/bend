import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomRoutine {
    id: string;
    name: string;
    coverImage: string;
    exercises: Array<{
        id: string;
        name: string;
        description: string;
        image_url: string;
        video_url?: string;
        duration_seconds: number;
        sequence: number;
    }>;
    totalDuration: number;
    createdAt: string;
}

const CUSTOM_ROUTINES_KEY = 'customRoutines';

export const saveCustomRoutine = async (routine: Omit<CustomRoutine, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const newRoutine: CustomRoutine = {
            ...routine,
            id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        };

        const updatedRoutines = [...existingRoutines, newRoutine];
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error saving custom routine:', error);
        return false;
    }
};

export const getCustomRoutines = async (): Promise<CustomRoutine[]> => {
    try {
        const routinesJson = await AsyncStorage.getItem(CUSTOM_ROUTINES_KEY);
        return routinesJson ? JSON.parse(routinesJson) : [];
    } catch (error) {
        console.error('Error getting custom routines:', error);
        return [];
    }
};

export const deleteCustomRoutine = async (routineId: string): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const updatedRoutines = existingRoutines.filter(routine => routine.id !== routineId);
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error deleting custom routine:', error);
        return false;
    }
};

export const updateCustomRoutine = async (routineId: string, updates: Partial<CustomRoutine>): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const updatedRoutines = existingRoutines.map(routine =>
            routine.id === routineId ? { ...routine, ...updates } : routine
        );
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error updating custom routine:', error);
        return false;
    }
};
